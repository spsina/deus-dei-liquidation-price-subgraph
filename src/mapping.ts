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
  return userPosition;
}

function updateLiquidationPrice(
  userPosition: UserPosition,
  contract: DeiLenderSolidex,
  save: bool
): void {
  let price = contract.getLiquidationPrice(
    Address.fromBytes(userPosition.address)
  );
  userPosition.collateralLiquidationPrice = price;
  // if you know you'll save the object later, you can disable saving here
  if (save) userPosition.save();
}

export function handleAddCollateral(event: AddCollateral): void {
  let to = event.params.to; // this is the address that received the collateral
  let contract = DeiLenderSolidex.bind(event.address);
  let userPosition = getOrCreateUserPosition(to);
  userPosition.address = to;
  userPosition.collateralAmount += event.params.amount;
  updateLiquidationPrice(userPosition, contract, false);
  userPosition.save();
}

export function handleAddCollateral_backup(event: AddCollateral): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex());

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0);
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1);

  // Entity fields can be set based on event parameters
  entity.from = event.params.from;
  entity.to = event.params.to;

  // Entities can be written to the store with `.save()`
  entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.BORROW_OPENING_FEE(...)
  // - contract.LIQUIDATION_RATIO(...)
  // - contract.accrueInfo(...)
  // - contract.borrow(...)
  // - contract.collateral(...)
  // - contract.getDebt(...)
  // - contract.getLiquidationPrice(...)
  // - contract.getRepayAmount(...)
  // - contract.getWithdrawableCollateralAmount(...)
  // - contract.isSolvent(...)
  // - contract.lpDepositor(...)
  // - contract.maxCap(...)
  // - contract.mintHelper(...)
  // - contract.oracle(...)
  // - contract.owner(...)
  // - contract.pendingOwner(...)
  // - contract.repayBase(...)
  // - contract.repayElastic(...)
  // - contract.solid(...)
  // - contract.solidex(...)
  // - contract.totalBorrow(...)
  // - contract.totalCollateral(...)
  // - contract.userBorrow(...)
  // - contract.userCollateral(...)
  // - contract.userHolder(...)
}

export function handleBorrow(event: Borrow): void {}

export function handleLiquidate(event: Liquidate): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRemoveCollateral(event: RemoveCollateral): void {}

export function handleRepay(event: Repay): void {}

export function handleUpdateAccrue(event: UpdateAccrue): void {}
