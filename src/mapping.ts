import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  DeiLenderSolidex,
  AddCollateral,
  Borrow,
  Liquidate,
  OwnershipTransferred,
  RemoveCollateral,
  Repay,
  UpdateAccrue,
} from "../generated/DeiLenderSolidex/DeiLenderSolidex";
import { DeusPriceForLiquidation } from "../generated/DeiLenderSolidex/DeusPriceForLiquidation";
import { UserPosition } from "../generated/schema";

const lenderAddress = "0x118FF56bb12E5E0EfC14454B8D7Fa6009487D64E";
const deusLiqPriceAddress = "0xF1A8165893CC8Da012344B51feB4de0044dDD4E6";

function getOrCreateUserPosition(address: Address): UserPosition {
  let userPosition = UserPosition.load(address.toHex());
  if (!userPosition) userPosition = new UserPosition(address.toHex());
  userPosition.address = address;
  userPosition.save();
  return userPosition;
}

function updateLiquidationPrice(
  userId: string,
  contractAddress: Address,
  save: bool = true
): void {
  let userPosition = UserPosition.load(userId);
  if (!userPosition) return;
  let collateralLiquidationPriceContract = DeiLenderSolidex.bind(
    contractAddress
  );
  let deusLiqPriceContract = DeusPriceForLiquidation.bind(
    Address.fromString(deusLiqPriceAddress)
  );

  let collatPrice = collateralLiquidationPriceContract.getLiquidationPrice(
    Address.fromBytes(userPosition.address)
  );
  let deusPrice = deusLiqPriceContract.deusPriceForLiquidation(
    Address.fromString(lenderAddress),
    Address.fromBytes(userPosition.address),
    BigInt.fromI32(1000)
  );

  userPosition.collateralLiquidationPrice = collatPrice;
  userPosition.deusLiquidationPrice = deusPrice;

  // if you know you'll save the object later, you can disable saving here
  if (save) userPosition.save();
}

export function handleAddCollateral(event: AddCollateral): void {
  // ensures that a position gets created if this is the first time user deposited collateral
  let userPosition = getOrCreateUserPosition(event.params.to);
  updateLiquidationPrice(userPosition.id, event.address);
}

export function handleRemoveCollateral(event: RemoveCollateral): void {
  // we should only update userPosition if users position is already being tracked
  updateLiquidationPrice(event.params.from.toHex(), event.address);
}

export function handleBorrow(event: Borrow): void {
  // we should only update userPosition if users position is already being tracked
  updateLiquidationPrice(event.params.from.toHex(), event.address);
}

export function handleRepay(event: Repay): void {
  // we should only update userPosition if users position is already being tracked
  updateLiquidationPrice(event.params.to.toHex(), event.address);
}

export function handleLiquidate(event: Liquidate): void {
  // todo: handle liquidate
}
