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
import { ExampleEntity, UserPosition } from "../generated/schema";

function getOrCreateUserPosition(address: Address): UserPosition {
  let userPosition = UserPosition.load(address.toHex());
  if (!userPosition) userPosition = new UserPosition(address.toHex());
  userPosition.address = address;
  return userPosition;
}

function updateLiquidationPrice(
  userId: string,
  contractAddress: Address,
  save: bool = true
): void {
  let userPosition = UserPosition.load(userId);
  if (!userPosition) return;
  let contract = DeiLenderSolidex.bind(contractAddress);
  let price = contract.getLiquidationPrice(
    Address.fromBytes(userPosition.address)
  );
  userPosition.collateralLiquidationPrice = price;
  // todo: calculate deus liquidation price

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
