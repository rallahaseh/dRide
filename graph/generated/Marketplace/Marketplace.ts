// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class NFTListed extends ethereum.Event {
  get params(): NFTListed__Params {
    return new NFTListed__Params(this);
  }
}

export class NFTListed__Params {
  _event: NFTListed;

  constructor(event: NFTListed) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get renter(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get nftContract(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get tokenURI(): string {
    return this._event.parameters[4].value.toString();
  }

  get pricePerDay(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get startDateUNIX(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get endDateUNIX(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }

  get expiryDate(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }
}

export class NFTRented extends ethereum.Event {
  get params(): NFTRented__Params {
    return new NFTRented__Params(this);
  }
}

export class NFTRented__Params {
  _event: NFTRented;

  constructor(event: NFTRented) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get renter(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get nftContract(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get tokenURI(): string {
    return this._event.parameters[4].value.toString();
  }

  get startDateUNIX(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get endDateUNIX(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get expiryDate(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }

  get rentalFee(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }
}

export class NFTUnlisted extends ethereum.Event {
  get params(): NFTUnlisted__Params {
    return new NFTUnlisted__Params(this);
  }
}

export class NFTUnlisted__Params {
  _event: NFTUnlisted;

  constructor(event: NFTUnlisted) {
    this._event = event;
  }

  get unlistSender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get nftContract(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get refund(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Marketplace__getAllListingsResultValue0Struct extends ethereum.Tuple {
  get owner(): Address {
    return this[0].toAddress();
  }

  get renter(): Address {
    return this[1].toAddress();
  }

  get nftContract(): Address {
    return this[2].toAddress();
  }

  get tokenId(): BigInt {
    return this[3].toBigInt();
  }

  get pricePerDay(): BigInt {
    return this[4].toBigInt();
  }

  get startDateUNIX(): BigInt {
    return this[5].toBigInt();
  }

  get endDateUNIX(): BigInt {
    return this[6].toBigInt();
  }

  get expiryDate(): BigInt {
    return this[7].toBigInt();
  }
}

export class Marketplace extends ethereum.SmartContract {
  static bind(address: Address): Marketplace {
    return new Marketplace("Marketplace", address);
  }

  contractBalance(): BigInt {
    let result = super.call(
      "contractBalance",
      "contractBalance():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_contractBalance(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "contractBalance",
      "contractBalance():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getAllListings(): Array<Marketplace__getAllListingsResultValue0Struct> {
    let result = super.call(
      "getAllListings",
      "getAllListings():((address,address,address,uint256,uint256,uint256,uint256,uint256)[])",
      []
    );

    return result[0].toTupleArray<
      Marketplace__getAllListingsResultValue0Struct
    >();
  }

  try_getAllListings(): ethereum.CallResult<
    Array<Marketplace__getAllListingsResultValue0Struct>
  > {
    let result = super.tryCall(
      "getAllListings",
      "getAllListings():((address,address,address,uint256,uint256,uint256,uint256,uint256)[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<Marketplace__getAllListingsResultValue0Struct>()
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get paymentTokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get rentFee(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ListNFTCall extends ethereum.Call {
  get inputs(): ListNFTCall__Inputs {
    return new ListNFTCall__Inputs(this);
  }

  get outputs(): ListNFTCall__Outputs {
    return new ListNFTCall__Outputs(this);
  }
}

export class ListNFTCall__Inputs {
  _call: ListNFTCall;

  constructor(call: ListNFTCall) {
    this._call = call;
  }

  get nftContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get pricePerDay(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get startDateUNIX(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get endDateUNIX(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class ListNFTCall__Outputs {
  _call: ListNFTCall;

  constructor(call: ListNFTCall) {
    this._call = call;
  }
}

export class RentNFTCall extends ethereum.Call {
  get inputs(): RentNFTCall__Inputs {
    return new RentNFTCall__Inputs(this);
  }

  get outputs(): RentNFTCall__Outputs {
    return new RentNFTCall__Outputs(this);
  }
}

export class RentNFTCall__Inputs {
  _call: RentNFTCall;

  constructor(call: RentNFTCall) {
    this._call = call;
  }

  get nftContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get startDate(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get expiryDate(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get deadline(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get v(): i32 {
    return this._call.inputValues[5].value.toI32();
  }

  get r(): Bytes {
    return this._call.inputValues[6].value.toBytes();
  }

  get s(): Bytes {
    return this._call.inputValues[7].value.toBytes();
  }
}

export class RentNFTCall__Outputs {
  _call: RentNFTCall;

  constructor(call: RentNFTCall) {
    this._call = call;
  }
}

export class UnlistNFTCall extends ethereum.Call {
  get inputs(): UnlistNFTCall__Inputs {
    return new UnlistNFTCall__Inputs(this);
  }

  get outputs(): UnlistNFTCall__Outputs {
    return new UnlistNFTCall__Outputs(this);
  }
}

export class UnlistNFTCall__Inputs {
  _call: UnlistNFTCall;

  constructor(call: UnlistNFTCall) {
    this._call = call;
  }

  get nftContract(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get tokenId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class UnlistNFTCall__Outputs {
  _call: UnlistNFTCall;

  constructor(call: UnlistNFTCall) {
    this._call = call;
  }
}

export class WithdrawalContractBalanceCall extends ethereum.Call {
  get inputs(): WithdrawalContractBalanceCall__Inputs {
    return new WithdrawalContractBalanceCall__Inputs(this);
  }

  get outputs(): WithdrawalContractBalanceCall__Outputs {
    return new WithdrawalContractBalanceCall__Outputs(this);
  }
}

export class WithdrawalContractBalanceCall__Inputs {
  _call: WithdrawalContractBalanceCall;

  constructor(call: WithdrawalContractBalanceCall) {
    this._call = call;
  }
}

export class WithdrawalContractBalanceCall__Outputs {
  _call: WithdrawalContractBalanceCall;

  constructor(call: WithdrawalContractBalanceCall) {
    this._call = call;
  }
}

export class WithdrawalUserBalanceCall extends ethereum.Call {
  get inputs(): WithdrawalUserBalanceCall__Inputs {
    return new WithdrawalUserBalanceCall__Inputs(this);
  }

  get outputs(): WithdrawalUserBalanceCall__Outputs {
    return new WithdrawalUserBalanceCall__Outputs(this);
  }
}

export class WithdrawalUserBalanceCall__Inputs {
  _call: WithdrawalUserBalanceCall;

  constructor(call: WithdrawalUserBalanceCall) {
    this._call = call;
  }
}

export class WithdrawalUserBalanceCall__Outputs {
  _call: WithdrawalUserBalanceCall;

  constructor(call: WithdrawalUserBalanceCall) {
    this._call = call;
  }
}
