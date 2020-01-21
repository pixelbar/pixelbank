import { Entity, PrimaryKey, Property, IEntity } from 'mikro-orm'

@Entity()
export class User {
  @PrimaryKey()
  id: string

  @Property()
  name: string

  @Property()
  balance: number

  constructor(name: string) {
    this.name = name
  }
}

export type User = IEntity
