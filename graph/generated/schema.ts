// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Token must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Token", id.toString(), this);
    }
  }

  static load(id: string): Token | null {
    return changetype<Token | null>(store.get("Token", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenID(): BigInt {
    let value = this.get("tokenID");
    return value!.toBigInt();
  }

  set tokenID(value: BigInt) {
    this.set("tokenID", Value.fromBigInt(value));
  }

  get contentURI(): string {
    let value = this.get("contentURI");
    return value!.toString();
  }

  set contentURI(value: string) {
    this.set("contentURI", Value.fromString(value));
  }

  get metadataURI(): string {
    let value = this.get("metadataURI");
    return value!.toString();
  }

  set metadataURI(value: string) {
    this.set("metadataURI", Value.fromString(value));
  }

  get creationDate(): BigInt {
    let value = this.get("creationDate");
    return value!.toBigInt();
  }

  set creationDate(value: BigInt) {
    this.set("creationDate", Value.fromBigInt(value));
  }

  get rentalStartDate(): BigInt | null {
    let value = this.get("rentalStartDate");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set rentalStartDate(value: BigInt | null) {
    if (!value) {
      this.unset("rentalStartDate");
    } else {
      this.set("rentalStartDate", Value.fromBigInt(<BigInt>value));
    }
  }

  get rentalFinishDate(): BigInt | null {
    let value = this.get("rentalFinishDate");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set rentalFinishDate(value: BigInt | null) {
    if (!value) {
      this.unset("rentalFinishDate");
    } else {
      this.set("rentalFinishDate", Value.fromBigInt(<BigInt>value));
    }
  }

  get creator(): string {
    let value = this.get("creator");
    return value!.toString();
  }

  set creator(value: string) {
    this.set("creator", Value.fromString(value));
  }

  get owner(): string | null {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set owner(value: string | null) {
    if (!value) {
      this.unset("owner");
    } else {
      this.set("owner", Value.fromString(<string>value));
    }
  }

  get renter(): string | null {
    let value = this.get("renter");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set renter(value: string | null) {
    if (!value) {
      this.unset("renter");
    } else {
      this.set("renter", Value.fromString(<string>value));
    }
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type User must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get mintedTokens(): Array<string> | null {
    let value = this.get("mintedTokens");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set mintedTokens(value: Array<string> | null) {
    if (!value) {
      this.unset("mintedTokens");
    } else {
      this.set("mintedTokens", Value.fromStringArray(<Array<string>>value));
    }
  }

  get listedTokens(): Array<string> | null {
    let value = this.get("listedTokens");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set listedTokens(value: Array<string> | null) {
    if (!value) {
      this.unset("listedTokens");
    } else {
      this.set("listedTokens", Value.fromStringArray(<Array<string>>value));
    }
  }

  get rentedTokens(): Array<string> | null {
    let value = this.get("rentedTokens");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set rentedTokens(value: Array<string> | null) {
    if (!value) {
      this.unset("rentedTokens");
    } else {
      this.set("rentedTokens", Value.fromStringArray(<Array<string>>value));
    }
  }
}
