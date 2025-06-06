
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model EnYusufali
 * 
 */
export type EnYusufali = $Result.DefaultSelection<Prisma.$EnYusufaliPayload>
/**
 * Model QuranSajda
 * 
 */
export type QuranSajda = $Result.DefaultSelection<Prisma.$QuranSajdaPayload>
/**
 * Model QuranSurah
 * 
 */
export type QuranSurah = $Result.DefaultSelection<Prisma.$QuranSurahPayload>
/**
 * Model QuranText
 * 
 */
export type QuranText = $Result.DefaultSelection<Prisma.$QuranTextPayload>
/**
 * Model UserBookmark
 * 
 */
export type UserBookmark = $Result.DefaultSelection<Prisma.$UserBookmarkPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EnYusufalis
 * const enYusufalis = await prisma.enYusufali.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more EnYusufalis
   * const enYusufalis = await prisma.enYusufali.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.enYusufali`: Exposes CRUD operations for the **EnYusufali** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EnYusufalis
    * const enYusufalis = await prisma.enYusufali.findMany()
    * ```
    */
  get enYusufali(): Prisma.EnYusufaliDelegate<ExtArgs>;

  /**
   * `prisma.quranSajda`: Exposes CRUD operations for the **QuranSajda** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuranSajdas
    * const quranSajdas = await prisma.quranSajda.findMany()
    * ```
    */
  get quranSajda(): Prisma.QuranSajdaDelegate<ExtArgs>;

  /**
   * `prisma.quranSurah`: Exposes CRUD operations for the **QuranSurah** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuranSurahs
    * const quranSurahs = await prisma.quranSurah.findMany()
    * ```
    */
  get quranSurah(): Prisma.QuranSurahDelegate<ExtArgs>;

  /**
   * `prisma.quranText`: Exposes CRUD operations for the **QuranText** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuranTexts
    * const quranTexts = await prisma.quranText.findMany()
    * ```
    */
  get quranText(): Prisma.QuranTextDelegate<ExtArgs>;

  /**
   * `prisma.userBookmark`: Exposes CRUD operations for the **UserBookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserBookmarks
    * const userBookmarks = await prisma.userBookmark.findMany()
    * ```
    */
  get userBookmark(): Prisma.UserBookmarkDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    EnYusufali: 'EnYusufali',
    QuranSajda: 'QuranSajda',
    QuranSurah: 'QuranSurah',
    QuranText: 'QuranText',
    UserBookmark: 'UserBookmark'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "enYusufali" | "quranSajda" | "quranSurah" | "quranText" | "userBookmark"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      EnYusufali: {
        payload: Prisma.$EnYusufaliPayload<ExtArgs>
        fields: Prisma.EnYusufaliFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnYusufaliFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnYusufaliFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>
          }
          findFirst: {
            args: Prisma.EnYusufaliFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnYusufaliFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>
          }
          findMany: {
            args: Prisma.EnYusufaliFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>[]
          }
          create: {
            args: Prisma.EnYusufaliCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>
          }
          createMany: {
            args: Prisma.EnYusufaliCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnYusufaliCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>[]
          }
          delete: {
            args: Prisma.EnYusufaliDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>
          }
          update: {
            args: Prisma.EnYusufaliUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>
          }
          deleteMany: {
            args: Prisma.EnYusufaliDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnYusufaliUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EnYusufaliUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnYusufaliPayload>
          }
          aggregate: {
            args: Prisma.EnYusufaliAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnYusufali>
          }
          groupBy: {
            args: Prisma.EnYusufaliGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnYusufaliGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnYusufaliCountArgs<ExtArgs>
            result: $Utils.Optional<EnYusufaliCountAggregateOutputType> | number
          }
        }
      }
      QuranSajda: {
        payload: Prisma.$QuranSajdaPayload<ExtArgs>
        fields: Prisma.QuranSajdaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuranSajdaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuranSajdaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>
          }
          findFirst: {
            args: Prisma.QuranSajdaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuranSajdaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>
          }
          findMany: {
            args: Prisma.QuranSajdaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>[]
          }
          create: {
            args: Prisma.QuranSajdaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>
          }
          createMany: {
            args: Prisma.QuranSajdaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuranSajdaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>[]
          }
          delete: {
            args: Prisma.QuranSajdaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>
          }
          update: {
            args: Prisma.QuranSajdaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>
          }
          deleteMany: {
            args: Prisma.QuranSajdaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuranSajdaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuranSajdaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSajdaPayload>
          }
          aggregate: {
            args: Prisma.QuranSajdaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuranSajda>
          }
          groupBy: {
            args: Prisma.QuranSajdaGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuranSajdaGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuranSajdaCountArgs<ExtArgs>
            result: $Utils.Optional<QuranSajdaCountAggregateOutputType> | number
          }
        }
      }
      QuranSurah: {
        payload: Prisma.$QuranSurahPayload<ExtArgs>
        fields: Prisma.QuranSurahFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuranSurahFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuranSurahFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>
          }
          findFirst: {
            args: Prisma.QuranSurahFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuranSurahFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>
          }
          findMany: {
            args: Prisma.QuranSurahFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>[]
          }
          create: {
            args: Prisma.QuranSurahCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>
          }
          createMany: {
            args: Prisma.QuranSurahCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuranSurahCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>[]
          }
          delete: {
            args: Prisma.QuranSurahDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>
          }
          update: {
            args: Prisma.QuranSurahUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>
          }
          deleteMany: {
            args: Prisma.QuranSurahDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuranSurahUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuranSurahUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranSurahPayload>
          }
          aggregate: {
            args: Prisma.QuranSurahAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuranSurah>
          }
          groupBy: {
            args: Prisma.QuranSurahGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuranSurahGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuranSurahCountArgs<ExtArgs>
            result: $Utils.Optional<QuranSurahCountAggregateOutputType> | number
          }
        }
      }
      QuranText: {
        payload: Prisma.$QuranTextPayload<ExtArgs>
        fields: Prisma.QuranTextFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuranTextFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuranTextFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>
          }
          findFirst: {
            args: Prisma.QuranTextFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuranTextFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>
          }
          findMany: {
            args: Prisma.QuranTextFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>[]
          }
          create: {
            args: Prisma.QuranTextCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>
          }
          createMany: {
            args: Prisma.QuranTextCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuranTextCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>[]
          }
          delete: {
            args: Prisma.QuranTextDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>
          }
          update: {
            args: Prisma.QuranTextUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>
          }
          deleteMany: {
            args: Prisma.QuranTextDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuranTextUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QuranTextUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuranTextPayload>
          }
          aggregate: {
            args: Prisma.QuranTextAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuranText>
          }
          groupBy: {
            args: Prisma.QuranTextGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuranTextGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuranTextCountArgs<ExtArgs>
            result: $Utils.Optional<QuranTextCountAggregateOutputType> | number
          }
        }
      }
      UserBookmark: {
        payload: Prisma.$UserBookmarkPayload<ExtArgs>
        fields: Prisma.UserBookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserBookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserBookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>
          }
          findFirst: {
            args: Prisma.UserBookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserBookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>
          }
          findMany: {
            args: Prisma.UserBookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>[]
          }
          create: {
            args: Prisma.UserBookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>
          }
          createMany: {
            args: Prisma.UserBookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserBookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>[]
          }
          delete: {
            args: Prisma.UserBookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>
          }
          update: {
            args: Prisma.UserBookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>
          }
          deleteMany: {
            args: Prisma.UserBookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserBookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserBookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBookmarkPayload>
          }
          aggregate: {
            args: Prisma.UserBookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserBookmark>
          }
          groupBy: {
            args: Prisma.UserBookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserBookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserBookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<UserBookmarkCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.DriverAdapter | null
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model EnYusufali
   */

  export type AggregateEnYusufali = {
    _count: EnYusufaliCountAggregateOutputType | null
    _avg: EnYusufaliAvgAggregateOutputType | null
    _sum: EnYusufaliSumAggregateOutputType | null
    _min: EnYusufaliMinAggregateOutputType | null
    _max: EnYusufaliMaxAggregateOutputType | null
  }

  export type EnYusufaliAvgAggregateOutputType = {
    index: number | null
    sura: number | null
    aya: number | null
  }

  export type EnYusufaliSumAggregateOutputType = {
    index: number | null
    sura: number | null
    aya: number | null
  }

  export type EnYusufaliMinAggregateOutputType = {
    index: number | null
    sura: number | null
    aya: number | null
    text: string | null
  }

  export type EnYusufaliMaxAggregateOutputType = {
    index: number | null
    sura: number | null
    aya: number | null
    text: string | null
  }

  export type EnYusufaliCountAggregateOutputType = {
    index: number
    sura: number
    aya: number
    text: number
    _all: number
  }


  export type EnYusufaliAvgAggregateInputType = {
    index?: true
    sura?: true
    aya?: true
  }

  export type EnYusufaliSumAggregateInputType = {
    index?: true
    sura?: true
    aya?: true
  }

  export type EnYusufaliMinAggregateInputType = {
    index?: true
    sura?: true
    aya?: true
    text?: true
  }

  export type EnYusufaliMaxAggregateInputType = {
    index?: true
    sura?: true
    aya?: true
    text?: true
  }

  export type EnYusufaliCountAggregateInputType = {
    index?: true
    sura?: true
    aya?: true
    text?: true
    _all?: true
  }

  export type EnYusufaliAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnYusufali to aggregate.
     */
    where?: EnYusufaliWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnYusufalis to fetch.
     */
    orderBy?: EnYusufaliOrderByWithRelationInput | EnYusufaliOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnYusufaliWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnYusufalis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnYusufalis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EnYusufalis
    **/
    _count?: true | EnYusufaliCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EnYusufaliAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EnYusufaliSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnYusufaliMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnYusufaliMaxAggregateInputType
  }

  export type GetEnYusufaliAggregateType<T extends EnYusufaliAggregateArgs> = {
        [P in keyof T & keyof AggregateEnYusufali]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnYusufali[P]>
      : GetScalarType<T[P], AggregateEnYusufali[P]>
  }




  export type EnYusufaliGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnYusufaliWhereInput
    orderBy?: EnYusufaliOrderByWithAggregationInput | EnYusufaliOrderByWithAggregationInput[]
    by: EnYusufaliScalarFieldEnum[] | EnYusufaliScalarFieldEnum
    having?: EnYusufaliScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnYusufaliCountAggregateInputType | true
    _avg?: EnYusufaliAvgAggregateInputType
    _sum?: EnYusufaliSumAggregateInputType
    _min?: EnYusufaliMinAggregateInputType
    _max?: EnYusufaliMaxAggregateInputType
  }

  export type EnYusufaliGroupByOutputType = {
    index: number
    sura: number
    aya: number
    text: string
    _count: EnYusufaliCountAggregateOutputType | null
    _avg: EnYusufaliAvgAggregateOutputType | null
    _sum: EnYusufaliSumAggregateOutputType | null
    _min: EnYusufaliMinAggregateOutputType | null
    _max: EnYusufaliMaxAggregateOutputType | null
  }

  type GetEnYusufaliGroupByPayload<T extends EnYusufaliGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnYusufaliGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnYusufaliGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnYusufaliGroupByOutputType[P]>
            : GetScalarType<T[P], EnYusufaliGroupByOutputType[P]>
        }
      >
    >


  export type EnYusufaliSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    index?: boolean
    sura?: boolean
    aya?: boolean
    text?: boolean
  }, ExtArgs["result"]["enYusufali"]>

  export type EnYusufaliSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    index?: boolean
    sura?: boolean
    aya?: boolean
    text?: boolean
  }, ExtArgs["result"]["enYusufali"]>

  export type EnYusufaliSelectScalar = {
    index?: boolean
    sura?: boolean
    aya?: boolean
    text?: boolean
  }


  export type $EnYusufaliPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EnYusufali"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      index: number
      sura: number
      aya: number
      text: string
    }, ExtArgs["result"]["enYusufali"]>
    composites: {}
  }

  type EnYusufaliGetPayload<S extends boolean | null | undefined | EnYusufaliDefaultArgs> = $Result.GetResult<Prisma.$EnYusufaliPayload, S>

  type EnYusufaliCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EnYusufaliFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EnYusufaliCountAggregateInputType | true
    }

  export interface EnYusufaliDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EnYusufali'], meta: { name: 'EnYusufali' } }
    /**
     * Find zero or one EnYusufali that matches the filter.
     * @param {EnYusufaliFindUniqueArgs} args - Arguments to find a EnYusufali
     * @example
     * // Get one EnYusufali
     * const enYusufali = await prisma.enYusufali.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnYusufaliFindUniqueArgs>(args: SelectSubset<T, EnYusufaliFindUniqueArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EnYusufali that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EnYusufaliFindUniqueOrThrowArgs} args - Arguments to find a EnYusufali
     * @example
     * // Get one EnYusufali
     * const enYusufali = await prisma.enYusufali.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnYusufaliFindUniqueOrThrowArgs>(args: SelectSubset<T, EnYusufaliFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EnYusufali that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliFindFirstArgs} args - Arguments to find a EnYusufali
     * @example
     * // Get one EnYusufali
     * const enYusufali = await prisma.enYusufali.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnYusufaliFindFirstArgs>(args?: SelectSubset<T, EnYusufaliFindFirstArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EnYusufali that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliFindFirstOrThrowArgs} args - Arguments to find a EnYusufali
     * @example
     * // Get one EnYusufali
     * const enYusufali = await prisma.enYusufali.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnYusufaliFindFirstOrThrowArgs>(args?: SelectSubset<T, EnYusufaliFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EnYusufalis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EnYusufalis
     * const enYusufalis = await prisma.enYusufali.findMany()
     * 
     * // Get first 10 EnYusufalis
     * const enYusufalis = await prisma.enYusufali.findMany({ take: 10 })
     * 
     * // Only select the `index`
     * const enYusufaliWithIndexOnly = await prisma.enYusufali.findMany({ select: { index: true } })
     * 
     */
    findMany<T extends EnYusufaliFindManyArgs>(args?: SelectSubset<T, EnYusufaliFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EnYusufali.
     * @param {EnYusufaliCreateArgs} args - Arguments to create a EnYusufali.
     * @example
     * // Create one EnYusufali
     * const EnYusufali = await prisma.enYusufali.create({
     *   data: {
     *     // ... data to create a EnYusufali
     *   }
     * })
     * 
     */
    create<T extends EnYusufaliCreateArgs>(args: SelectSubset<T, EnYusufaliCreateArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EnYusufalis.
     * @param {EnYusufaliCreateManyArgs} args - Arguments to create many EnYusufalis.
     * @example
     * // Create many EnYusufalis
     * const enYusufali = await prisma.enYusufali.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnYusufaliCreateManyArgs>(args?: SelectSubset<T, EnYusufaliCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EnYusufalis and returns the data saved in the database.
     * @param {EnYusufaliCreateManyAndReturnArgs} args - Arguments to create many EnYusufalis.
     * @example
     * // Create many EnYusufalis
     * const enYusufali = await prisma.enYusufali.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EnYusufalis and only return the `index`
     * const enYusufaliWithIndexOnly = await prisma.enYusufali.createManyAndReturn({ 
     *   select: { index: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnYusufaliCreateManyAndReturnArgs>(args?: SelectSubset<T, EnYusufaliCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EnYusufali.
     * @param {EnYusufaliDeleteArgs} args - Arguments to delete one EnYusufali.
     * @example
     * // Delete one EnYusufali
     * const EnYusufali = await prisma.enYusufali.delete({
     *   where: {
     *     // ... filter to delete one EnYusufali
     *   }
     * })
     * 
     */
    delete<T extends EnYusufaliDeleteArgs>(args: SelectSubset<T, EnYusufaliDeleteArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EnYusufali.
     * @param {EnYusufaliUpdateArgs} args - Arguments to update one EnYusufali.
     * @example
     * // Update one EnYusufali
     * const enYusufali = await prisma.enYusufali.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnYusufaliUpdateArgs>(args: SelectSubset<T, EnYusufaliUpdateArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EnYusufalis.
     * @param {EnYusufaliDeleteManyArgs} args - Arguments to filter EnYusufalis to delete.
     * @example
     * // Delete a few EnYusufalis
     * const { count } = await prisma.enYusufali.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnYusufaliDeleteManyArgs>(args?: SelectSubset<T, EnYusufaliDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnYusufalis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EnYusufalis
     * const enYusufali = await prisma.enYusufali.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnYusufaliUpdateManyArgs>(args: SelectSubset<T, EnYusufaliUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EnYusufali.
     * @param {EnYusufaliUpsertArgs} args - Arguments to update or create a EnYusufali.
     * @example
     * // Update or create a EnYusufali
     * const enYusufali = await prisma.enYusufali.upsert({
     *   create: {
     *     // ... data to create a EnYusufali
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EnYusufali we want to update
     *   }
     * })
     */
    upsert<T extends EnYusufaliUpsertArgs>(args: SelectSubset<T, EnYusufaliUpsertArgs<ExtArgs>>): Prisma__EnYusufaliClient<$Result.GetResult<Prisma.$EnYusufaliPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EnYusufalis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliCountArgs} args - Arguments to filter EnYusufalis to count.
     * @example
     * // Count the number of EnYusufalis
     * const count = await prisma.enYusufali.count({
     *   where: {
     *     // ... the filter for the EnYusufalis we want to count
     *   }
     * })
    **/
    count<T extends EnYusufaliCountArgs>(
      args?: Subset<T, EnYusufaliCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnYusufaliCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EnYusufali.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnYusufaliAggregateArgs>(args: Subset<T, EnYusufaliAggregateArgs>): Prisma.PrismaPromise<GetEnYusufaliAggregateType<T>>

    /**
     * Group by EnYusufali.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnYusufaliGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnYusufaliGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnYusufaliGroupByArgs['orderBy'] }
        : { orderBy?: EnYusufaliGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnYusufaliGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnYusufaliGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EnYusufali model
   */
  readonly fields: EnYusufaliFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EnYusufali.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnYusufaliClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EnYusufali model
   */ 
  interface EnYusufaliFieldRefs {
    readonly index: FieldRef<"EnYusufali", 'Int'>
    readonly sura: FieldRef<"EnYusufali", 'Int'>
    readonly aya: FieldRef<"EnYusufali", 'Int'>
    readonly text: FieldRef<"EnYusufali", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EnYusufali findUnique
   */
  export type EnYusufaliFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * Filter, which EnYusufali to fetch.
     */
    where: EnYusufaliWhereUniqueInput
  }

  /**
   * EnYusufali findUniqueOrThrow
   */
  export type EnYusufaliFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * Filter, which EnYusufali to fetch.
     */
    where: EnYusufaliWhereUniqueInput
  }

  /**
   * EnYusufali findFirst
   */
  export type EnYusufaliFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * Filter, which EnYusufali to fetch.
     */
    where?: EnYusufaliWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnYusufalis to fetch.
     */
    orderBy?: EnYusufaliOrderByWithRelationInput | EnYusufaliOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnYusufalis.
     */
    cursor?: EnYusufaliWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnYusufalis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnYusufalis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnYusufalis.
     */
    distinct?: EnYusufaliScalarFieldEnum | EnYusufaliScalarFieldEnum[]
  }

  /**
   * EnYusufali findFirstOrThrow
   */
  export type EnYusufaliFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * Filter, which EnYusufali to fetch.
     */
    where?: EnYusufaliWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnYusufalis to fetch.
     */
    orderBy?: EnYusufaliOrderByWithRelationInput | EnYusufaliOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnYusufalis.
     */
    cursor?: EnYusufaliWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnYusufalis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnYusufalis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnYusufalis.
     */
    distinct?: EnYusufaliScalarFieldEnum | EnYusufaliScalarFieldEnum[]
  }

  /**
   * EnYusufali findMany
   */
  export type EnYusufaliFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * Filter, which EnYusufalis to fetch.
     */
    where?: EnYusufaliWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnYusufalis to fetch.
     */
    orderBy?: EnYusufaliOrderByWithRelationInput | EnYusufaliOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EnYusufalis.
     */
    cursor?: EnYusufaliWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnYusufalis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnYusufalis.
     */
    skip?: number
    distinct?: EnYusufaliScalarFieldEnum | EnYusufaliScalarFieldEnum[]
  }

  /**
   * EnYusufali create
   */
  export type EnYusufaliCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * The data needed to create a EnYusufali.
     */
    data: XOR<EnYusufaliCreateInput, EnYusufaliUncheckedCreateInput>
  }

  /**
   * EnYusufali createMany
   */
  export type EnYusufaliCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EnYusufalis.
     */
    data: EnYusufaliCreateManyInput | EnYusufaliCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnYusufali createManyAndReturn
   */
  export type EnYusufaliCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EnYusufalis.
     */
    data: EnYusufaliCreateManyInput | EnYusufaliCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnYusufali update
   */
  export type EnYusufaliUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * The data needed to update a EnYusufali.
     */
    data: XOR<EnYusufaliUpdateInput, EnYusufaliUncheckedUpdateInput>
    /**
     * Choose, which EnYusufali to update.
     */
    where: EnYusufaliWhereUniqueInput
  }

  /**
   * EnYusufali updateMany
   */
  export type EnYusufaliUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EnYusufalis.
     */
    data: XOR<EnYusufaliUpdateManyMutationInput, EnYusufaliUncheckedUpdateManyInput>
    /**
     * Filter which EnYusufalis to update
     */
    where?: EnYusufaliWhereInput
  }

  /**
   * EnYusufali upsert
   */
  export type EnYusufaliUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * The filter to search for the EnYusufali to update in case it exists.
     */
    where: EnYusufaliWhereUniqueInput
    /**
     * In case the EnYusufali found by the `where` argument doesn't exist, create a new EnYusufali with this data.
     */
    create: XOR<EnYusufaliCreateInput, EnYusufaliUncheckedCreateInput>
    /**
     * In case the EnYusufali was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnYusufaliUpdateInput, EnYusufaliUncheckedUpdateInput>
  }

  /**
   * EnYusufali delete
   */
  export type EnYusufaliDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
    /**
     * Filter which EnYusufali to delete.
     */
    where: EnYusufaliWhereUniqueInput
  }

  /**
   * EnYusufali deleteMany
   */
  export type EnYusufaliDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnYusufalis to delete
     */
    where?: EnYusufaliWhereInput
  }

  /**
   * EnYusufali without action
   */
  export type EnYusufaliDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnYusufali
     */
    select?: EnYusufaliSelect<ExtArgs> | null
  }


  /**
   * Model QuranSajda
   */

  export type AggregateQuranSajda = {
    _count: QuranSajdaCountAggregateOutputType | null
    _avg: QuranSajdaAvgAggregateOutputType | null
    _sum: QuranSajdaSumAggregateOutputType | null
    _min: QuranSajdaMinAggregateOutputType | null
    _max: QuranSajdaMaxAggregateOutputType | null
  }

  export type QuranSajdaAvgAggregateOutputType = {
    sajdaId: number | null
    surahNumber: number | null
    ayahNumber: number | null
  }

  export type QuranSajdaSumAggregateOutputType = {
    sajdaId: number | null
    surahNumber: number | null
    ayahNumber: number | null
  }

  export type QuranSajdaMinAggregateOutputType = {
    sajdaId: number | null
    surahNumber: number | null
    ayahNumber: number | null
    type: string | null
  }

  export type QuranSajdaMaxAggregateOutputType = {
    sajdaId: number | null
    surahNumber: number | null
    ayahNumber: number | null
    type: string | null
  }

  export type QuranSajdaCountAggregateOutputType = {
    sajdaId: number
    surahNumber: number
    ayahNumber: number
    type: number
    _all: number
  }


  export type QuranSajdaAvgAggregateInputType = {
    sajdaId?: true
    surahNumber?: true
    ayahNumber?: true
  }

  export type QuranSajdaSumAggregateInputType = {
    sajdaId?: true
    surahNumber?: true
    ayahNumber?: true
  }

  export type QuranSajdaMinAggregateInputType = {
    sajdaId?: true
    surahNumber?: true
    ayahNumber?: true
    type?: true
  }

  export type QuranSajdaMaxAggregateInputType = {
    sajdaId?: true
    surahNumber?: true
    ayahNumber?: true
    type?: true
  }

  export type QuranSajdaCountAggregateInputType = {
    sajdaId?: true
    surahNumber?: true
    ayahNumber?: true
    type?: true
    _all?: true
  }

  export type QuranSajdaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuranSajda to aggregate.
     */
    where?: QuranSajdaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSajdas to fetch.
     */
    orderBy?: QuranSajdaOrderByWithRelationInput | QuranSajdaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuranSajdaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSajdas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSajdas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuranSajdas
    **/
    _count?: true | QuranSajdaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuranSajdaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuranSajdaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuranSajdaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuranSajdaMaxAggregateInputType
  }

  export type GetQuranSajdaAggregateType<T extends QuranSajdaAggregateArgs> = {
        [P in keyof T & keyof AggregateQuranSajda]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuranSajda[P]>
      : GetScalarType<T[P], AggregateQuranSajda[P]>
  }




  export type QuranSajdaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuranSajdaWhereInput
    orderBy?: QuranSajdaOrderByWithAggregationInput | QuranSajdaOrderByWithAggregationInput[]
    by: QuranSajdaScalarFieldEnum[] | QuranSajdaScalarFieldEnum
    having?: QuranSajdaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuranSajdaCountAggregateInputType | true
    _avg?: QuranSajdaAvgAggregateInputType
    _sum?: QuranSajdaSumAggregateInputType
    _min?: QuranSajdaMinAggregateInputType
    _max?: QuranSajdaMaxAggregateInputType
  }

  export type QuranSajdaGroupByOutputType = {
    sajdaId: number
    surahNumber: number
    ayahNumber: number
    type: string | null
    _count: QuranSajdaCountAggregateOutputType | null
    _avg: QuranSajdaAvgAggregateOutputType | null
    _sum: QuranSajdaSumAggregateOutputType | null
    _min: QuranSajdaMinAggregateOutputType | null
    _max: QuranSajdaMaxAggregateOutputType | null
  }

  type GetQuranSajdaGroupByPayload<T extends QuranSajdaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuranSajdaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuranSajdaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuranSajdaGroupByOutputType[P]>
            : GetScalarType<T[P], QuranSajdaGroupByOutputType[P]>
        }
      >
    >


  export type QuranSajdaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sajdaId?: boolean
    surahNumber?: boolean
    ayahNumber?: boolean
    type?: boolean
  }, ExtArgs["result"]["quranSajda"]>

  export type QuranSajdaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    sajdaId?: boolean
    surahNumber?: boolean
    ayahNumber?: boolean
    type?: boolean
  }, ExtArgs["result"]["quranSajda"]>

  export type QuranSajdaSelectScalar = {
    sajdaId?: boolean
    surahNumber?: boolean
    ayahNumber?: boolean
    type?: boolean
  }


  export type $QuranSajdaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuranSajda"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      sajdaId: number
      surahNumber: number
      ayahNumber: number
      type: string | null
    }, ExtArgs["result"]["quranSajda"]>
    composites: {}
  }

  type QuranSajdaGetPayload<S extends boolean | null | undefined | QuranSajdaDefaultArgs> = $Result.GetResult<Prisma.$QuranSajdaPayload, S>

  type QuranSajdaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuranSajdaFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuranSajdaCountAggregateInputType | true
    }

  export interface QuranSajdaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuranSajda'], meta: { name: 'QuranSajda' } }
    /**
     * Find zero or one QuranSajda that matches the filter.
     * @param {QuranSajdaFindUniqueArgs} args - Arguments to find a QuranSajda
     * @example
     * // Get one QuranSajda
     * const quranSajda = await prisma.quranSajda.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuranSajdaFindUniqueArgs>(args: SelectSubset<T, QuranSajdaFindUniqueArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QuranSajda that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuranSajdaFindUniqueOrThrowArgs} args - Arguments to find a QuranSajda
     * @example
     * // Get one QuranSajda
     * const quranSajda = await prisma.quranSajda.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuranSajdaFindUniqueOrThrowArgs>(args: SelectSubset<T, QuranSajdaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QuranSajda that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaFindFirstArgs} args - Arguments to find a QuranSajda
     * @example
     * // Get one QuranSajda
     * const quranSajda = await prisma.quranSajda.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuranSajdaFindFirstArgs>(args?: SelectSubset<T, QuranSajdaFindFirstArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QuranSajda that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaFindFirstOrThrowArgs} args - Arguments to find a QuranSajda
     * @example
     * // Get one QuranSajda
     * const quranSajda = await prisma.quranSajda.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuranSajdaFindFirstOrThrowArgs>(args?: SelectSubset<T, QuranSajdaFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QuranSajdas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuranSajdas
     * const quranSajdas = await prisma.quranSajda.findMany()
     * 
     * // Get first 10 QuranSajdas
     * const quranSajdas = await prisma.quranSajda.findMany({ take: 10 })
     * 
     * // Only select the `sajdaId`
     * const quranSajdaWithSajdaIdOnly = await prisma.quranSajda.findMany({ select: { sajdaId: true } })
     * 
     */
    findMany<T extends QuranSajdaFindManyArgs>(args?: SelectSubset<T, QuranSajdaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QuranSajda.
     * @param {QuranSajdaCreateArgs} args - Arguments to create a QuranSajda.
     * @example
     * // Create one QuranSajda
     * const QuranSajda = await prisma.quranSajda.create({
     *   data: {
     *     // ... data to create a QuranSajda
     *   }
     * })
     * 
     */
    create<T extends QuranSajdaCreateArgs>(args: SelectSubset<T, QuranSajdaCreateArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QuranSajdas.
     * @param {QuranSajdaCreateManyArgs} args - Arguments to create many QuranSajdas.
     * @example
     * // Create many QuranSajdas
     * const quranSajda = await prisma.quranSajda.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuranSajdaCreateManyArgs>(args?: SelectSubset<T, QuranSajdaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuranSajdas and returns the data saved in the database.
     * @param {QuranSajdaCreateManyAndReturnArgs} args - Arguments to create many QuranSajdas.
     * @example
     * // Create many QuranSajdas
     * const quranSajda = await prisma.quranSajda.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuranSajdas and only return the `sajdaId`
     * const quranSajdaWithSajdaIdOnly = await prisma.quranSajda.createManyAndReturn({ 
     *   select: { sajdaId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuranSajdaCreateManyAndReturnArgs>(args?: SelectSubset<T, QuranSajdaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QuranSajda.
     * @param {QuranSajdaDeleteArgs} args - Arguments to delete one QuranSajda.
     * @example
     * // Delete one QuranSajda
     * const QuranSajda = await prisma.quranSajda.delete({
     *   where: {
     *     // ... filter to delete one QuranSajda
     *   }
     * })
     * 
     */
    delete<T extends QuranSajdaDeleteArgs>(args: SelectSubset<T, QuranSajdaDeleteArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QuranSajda.
     * @param {QuranSajdaUpdateArgs} args - Arguments to update one QuranSajda.
     * @example
     * // Update one QuranSajda
     * const quranSajda = await prisma.quranSajda.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuranSajdaUpdateArgs>(args: SelectSubset<T, QuranSajdaUpdateArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QuranSajdas.
     * @param {QuranSajdaDeleteManyArgs} args - Arguments to filter QuranSajdas to delete.
     * @example
     * // Delete a few QuranSajdas
     * const { count } = await prisma.quranSajda.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuranSajdaDeleteManyArgs>(args?: SelectSubset<T, QuranSajdaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuranSajdas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuranSajdas
     * const quranSajda = await prisma.quranSajda.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuranSajdaUpdateManyArgs>(args: SelectSubset<T, QuranSajdaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuranSajda.
     * @param {QuranSajdaUpsertArgs} args - Arguments to update or create a QuranSajda.
     * @example
     * // Update or create a QuranSajda
     * const quranSajda = await prisma.quranSajda.upsert({
     *   create: {
     *     // ... data to create a QuranSajda
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuranSajda we want to update
     *   }
     * })
     */
    upsert<T extends QuranSajdaUpsertArgs>(args: SelectSubset<T, QuranSajdaUpsertArgs<ExtArgs>>): Prisma__QuranSajdaClient<$Result.GetResult<Prisma.$QuranSajdaPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QuranSajdas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaCountArgs} args - Arguments to filter QuranSajdas to count.
     * @example
     * // Count the number of QuranSajdas
     * const count = await prisma.quranSajda.count({
     *   where: {
     *     // ... the filter for the QuranSajdas we want to count
     *   }
     * })
    **/
    count<T extends QuranSajdaCountArgs>(
      args?: Subset<T, QuranSajdaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuranSajdaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuranSajda.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuranSajdaAggregateArgs>(args: Subset<T, QuranSajdaAggregateArgs>): Prisma.PrismaPromise<GetQuranSajdaAggregateType<T>>

    /**
     * Group by QuranSajda.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSajdaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuranSajdaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuranSajdaGroupByArgs['orderBy'] }
        : { orderBy?: QuranSajdaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuranSajdaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuranSajdaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuranSajda model
   */
  readonly fields: QuranSajdaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuranSajda.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuranSajdaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuranSajda model
   */ 
  interface QuranSajdaFieldRefs {
    readonly sajdaId: FieldRef<"QuranSajda", 'Int'>
    readonly surahNumber: FieldRef<"QuranSajda", 'Int'>
    readonly ayahNumber: FieldRef<"QuranSajda", 'Int'>
    readonly type: FieldRef<"QuranSajda", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QuranSajda findUnique
   */
  export type QuranSajdaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * Filter, which QuranSajda to fetch.
     */
    where: QuranSajdaWhereUniqueInput
  }

  /**
   * QuranSajda findUniqueOrThrow
   */
  export type QuranSajdaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * Filter, which QuranSajda to fetch.
     */
    where: QuranSajdaWhereUniqueInput
  }

  /**
   * QuranSajda findFirst
   */
  export type QuranSajdaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * Filter, which QuranSajda to fetch.
     */
    where?: QuranSajdaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSajdas to fetch.
     */
    orderBy?: QuranSajdaOrderByWithRelationInput | QuranSajdaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuranSajdas.
     */
    cursor?: QuranSajdaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSajdas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSajdas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuranSajdas.
     */
    distinct?: QuranSajdaScalarFieldEnum | QuranSajdaScalarFieldEnum[]
  }

  /**
   * QuranSajda findFirstOrThrow
   */
  export type QuranSajdaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * Filter, which QuranSajda to fetch.
     */
    where?: QuranSajdaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSajdas to fetch.
     */
    orderBy?: QuranSajdaOrderByWithRelationInput | QuranSajdaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuranSajdas.
     */
    cursor?: QuranSajdaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSajdas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSajdas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuranSajdas.
     */
    distinct?: QuranSajdaScalarFieldEnum | QuranSajdaScalarFieldEnum[]
  }

  /**
   * QuranSajda findMany
   */
  export type QuranSajdaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * Filter, which QuranSajdas to fetch.
     */
    where?: QuranSajdaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSajdas to fetch.
     */
    orderBy?: QuranSajdaOrderByWithRelationInput | QuranSajdaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuranSajdas.
     */
    cursor?: QuranSajdaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSajdas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSajdas.
     */
    skip?: number
    distinct?: QuranSajdaScalarFieldEnum | QuranSajdaScalarFieldEnum[]
  }

  /**
   * QuranSajda create
   */
  export type QuranSajdaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * The data needed to create a QuranSajda.
     */
    data: XOR<QuranSajdaCreateInput, QuranSajdaUncheckedCreateInput>
  }

  /**
   * QuranSajda createMany
   */
  export type QuranSajdaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuranSajdas.
     */
    data: QuranSajdaCreateManyInput | QuranSajdaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuranSajda createManyAndReturn
   */
  export type QuranSajdaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QuranSajdas.
     */
    data: QuranSajdaCreateManyInput | QuranSajdaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuranSajda update
   */
  export type QuranSajdaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * The data needed to update a QuranSajda.
     */
    data: XOR<QuranSajdaUpdateInput, QuranSajdaUncheckedUpdateInput>
    /**
     * Choose, which QuranSajda to update.
     */
    where: QuranSajdaWhereUniqueInput
  }

  /**
   * QuranSajda updateMany
   */
  export type QuranSajdaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuranSajdas.
     */
    data: XOR<QuranSajdaUpdateManyMutationInput, QuranSajdaUncheckedUpdateManyInput>
    /**
     * Filter which QuranSajdas to update
     */
    where?: QuranSajdaWhereInput
  }

  /**
   * QuranSajda upsert
   */
  export type QuranSajdaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * The filter to search for the QuranSajda to update in case it exists.
     */
    where: QuranSajdaWhereUniqueInput
    /**
     * In case the QuranSajda found by the `where` argument doesn't exist, create a new QuranSajda with this data.
     */
    create: XOR<QuranSajdaCreateInput, QuranSajdaUncheckedCreateInput>
    /**
     * In case the QuranSajda was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuranSajdaUpdateInput, QuranSajdaUncheckedUpdateInput>
  }

  /**
   * QuranSajda delete
   */
  export type QuranSajdaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
    /**
     * Filter which QuranSajda to delete.
     */
    where: QuranSajdaWhereUniqueInput
  }

  /**
   * QuranSajda deleteMany
   */
  export type QuranSajdaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuranSajdas to delete
     */
    where?: QuranSajdaWhereInput
  }

  /**
   * QuranSajda without action
   */
  export type QuranSajdaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSajda
     */
    select?: QuranSajdaSelect<ExtArgs> | null
  }


  /**
   * Model QuranSurah
   */

  export type AggregateQuranSurah = {
    _count: QuranSurahCountAggregateOutputType | null
    _avg: QuranSurahAvgAggregateOutputType | null
    _sum: QuranSurahSumAggregateOutputType | null
    _min: QuranSurahMinAggregateOutputType | null
    _max: QuranSurahMaxAggregateOutputType | null
  }

  export type QuranSurahAvgAggregateOutputType = {
    number: number | null
    ayas: number | null
    chronologicalOrder: number | null
    rukus: number | null
    startIndex: number | null
  }

  export type QuranSurahSumAggregateOutputType = {
    number: number | null
    ayas: number | null
    chronologicalOrder: number | null
    rukus: number | null
    startIndex: number | null
  }

  export type QuranSurahMinAggregateOutputType = {
    number: number | null
    arabicName: string | null
    transliteration: string | null
    englishName: string | null
    ayas: number | null
    revelationType: string | null
    chronologicalOrder: number | null
    rukus: number | null
    startIndex: number | null
  }

  export type QuranSurahMaxAggregateOutputType = {
    number: number | null
    arabicName: string | null
    transliteration: string | null
    englishName: string | null
    ayas: number | null
    revelationType: string | null
    chronologicalOrder: number | null
    rukus: number | null
    startIndex: number | null
  }

  export type QuranSurahCountAggregateOutputType = {
    number: number
    arabicName: number
    transliteration: number
    englishName: number
    ayas: number
    revelationType: number
    chronologicalOrder: number
    rukus: number
    startIndex: number
    _all: number
  }


  export type QuranSurahAvgAggregateInputType = {
    number?: true
    ayas?: true
    chronologicalOrder?: true
    rukus?: true
    startIndex?: true
  }

  export type QuranSurahSumAggregateInputType = {
    number?: true
    ayas?: true
    chronologicalOrder?: true
    rukus?: true
    startIndex?: true
  }

  export type QuranSurahMinAggregateInputType = {
    number?: true
    arabicName?: true
    transliteration?: true
    englishName?: true
    ayas?: true
    revelationType?: true
    chronologicalOrder?: true
    rukus?: true
    startIndex?: true
  }

  export type QuranSurahMaxAggregateInputType = {
    number?: true
    arabicName?: true
    transliteration?: true
    englishName?: true
    ayas?: true
    revelationType?: true
    chronologicalOrder?: true
    rukus?: true
    startIndex?: true
  }

  export type QuranSurahCountAggregateInputType = {
    number?: true
    arabicName?: true
    transliteration?: true
    englishName?: true
    ayas?: true
    revelationType?: true
    chronologicalOrder?: true
    rukus?: true
    startIndex?: true
    _all?: true
  }

  export type QuranSurahAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuranSurah to aggregate.
     */
    where?: QuranSurahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSurahs to fetch.
     */
    orderBy?: QuranSurahOrderByWithRelationInput | QuranSurahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuranSurahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSurahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSurahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuranSurahs
    **/
    _count?: true | QuranSurahCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuranSurahAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuranSurahSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuranSurahMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuranSurahMaxAggregateInputType
  }

  export type GetQuranSurahAggregateType<T extends QuranSurahAggregateArgs> = {
        [P in keyof T & keyof AggregateQuranSurah]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuranSurah[P]>
      : GetScalarType<T[P], AggregateQuranSurah[P]>
  }




  export type QuranSurahGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuranSurahWhereInput
    orderBy?: QuranSurahOrderByWithAggregationInput | QuranSurahOrderByWithAggregationInput[]
    by: QuranSurahScalarFieldEnum[] | QuranSurahScalarFieldEnum
    having?: QuranSurahScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuranSurahCountAggregateInputType | true
    _avg?: QuranSurahAvgAggregateInputType
    _sum?: QuranSurahSumAggregateInputType
    _min?: QuranSurahMinAggregateInputType
    _max?: QuranSurahMaxAggregateInputType
  }

  export type QuranSurahGroupByOutputType = {
    number: number
    arabicName: string
    transliteration: string
    englishName: string
    ayas: number
    revelationType: string
    chronologicalOrder: number
    rukus: number
    startIndex: number | null
    _count: QuranSurahCountAggregateOutputType | null
    _avg: QuranSurahAvgAggregateOutputType | null
    _sum: QuranSurahSumAggregateOutputType | null
    _min: QuranSurahMinAggregateOutputType | null
    _max: QuranSurahMaxAggregateOutputType | null
  }

  type GetQuranSurahGroupByPayload<T extends QuranSurahGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuranSurahGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuranSurahGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuranSurahGroupByOutputType[P]>
            : GetScalarType<T[P], QuranSurahGroupByOutputType[P]>
        }
      >
    >


  export type QuranSurahSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    number?: boolean
    arabicName?: boolean
    transliteration?: boolean
    englishName?: boolean
    ayas?: boolean
    revelationType?: boolean
    chronologicalOrder?: boolean
    rukus?: boolean
    startIndex?: boolean
  }, ExtArgs["result"]["quranSurah"]>

  export type QuranSurahSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    number?: boolean
    arabicName?: boolean
    transliteration?: boolean
    englishName?: boolean
    ayas?: boolean
    revelationType?: boolean
    chronologicalOrder?: boolean
    rukus?: boolean
    startIndex?: boolean
  }, ExtArgs["result"]["quranSurah"]>

  export type QuranSurahSelectScalar = {
    number?: boolean
    arabicName?: boolean
    transliteration?: boolean
    englishName?: boolean
    ayas?: boolean
    revelationType?: boolean
    chronologicalOrder?: boolean
    rukus?: boolean
    startIndex?: boolean
  }


  export type $QuranSurahPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuranSurah"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      number: number
      arabicName: string
      transliteration: string
      englishName: string
      ayas: number
      revelationType: string
      chronologicalOrder: number
      rukus: number
      startIndex: number | null
    }, ExtArgs["result"]["quranSurah"]>
    composites: {}
  }

  type QuranSurahGetPayload<S extends boolean | null | undefined | QuranSurahDefaultArgs> = $Result.GetResult<Prisma.$QuranSurahPayload, S>

  type QuranSurahCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuranSurahFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuranSurahCountAggregateInputType | true
    }

  export interface QuranSurahDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuranSurah'], meta: { name: 'QuranSurah' } }
    /**
     * Find zero or one QuranSurah that matches the filter.
     * @param {QuranSurahFindUniqueArgs} args - Arguments to find a QuranSurah
     * @example
     * // Get one QuranSurah
     * const quranSurah = await prisma.quranSurah.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuranSurahFindUniqueArgs>(args: SelectSubset<T, QuranSurahFindUniqueArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QuranSurah that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuranSurahFindUniqueOrThrowArgs} args - Arguments to find a QuranSurah
     * @example
     * // Get one QuranSurah
     * const quranSurah = await prisma.quranSurah.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuranSurahFindUniqueOrThrowArgs>(args: SelectSubset<T, QuranSurahFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QuranSurah that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahFindFirstArgs} args - Arguments to find a QuranSurah
     * @example
     * // Get one QuranSurah
     * const quranSurah = await prisma.quranSurah.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuranSurahFindFirstArgs>(args?: SelectSubset<T, QuranSurahFindFirstArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QuranSurah that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahFindFirstOrThrowArgs} args - Arguments to find a QuranSurah
     * @example
     * // Get one QuranSurah
     * const quranSurah = await prisma.quranSurah.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuranSurahFindFirstOrThrowArgs>(args?: SelectSubset<T, QuranSurahFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QuranSurahs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuranSurahs
     * const quranSurahs = await prisma.quranSurah.findMany()
     * 
     * // Get first 10 QuranSurahs
     * const quranSurahs = await prisma.quranSurah.findMany({ take: 10 })
     * 
     * // Only select the `number`
     * const quranSurahWithNumberOnly = await prisma.quranSurah.findMany({ select: { number: true } })
     * 
     */
    findMany<T extends QuranSurahFindManyArgs>(args?: SelectSubset<T, QuranSurahFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QuranSurah.
     * @param {QuranSurahCreateArgs} args - Arguments to create a QuranSurah.
     * @example
     * // Create one QuranSurah
     * const QuranSurah = await prisma.quranSurah.create({
     *   data: {
     *     // ... data to create a QuranSurah
     *   }
     * })
     * 
     */
    create<T extends QuranSurahCreateArgs>(args: SelectSubset<T, QuranSurahCreateArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QuranSurahs.
     * @param {QuranSurahCreateManyArgs} args - Arguments to create many QuranSurahs.
     * @example
     * // Create many QuranSurahs
     * const quranSurah = await prisma.quranSurah.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuranSurahCreateManyArgs>(args?: SelectSubset<T, QuranSurahCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuranSurahs and returns the data saved in the database.
     * @param {QuranSurahCreateManyAndReturnArgs} args - Arguments to create many QuranSurahs.
     * @example
     * // Create many QuranSurahs
     * const quranSurah = await prisma.quranSurah.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuranSurahs and only return the `number`
     * const quranSurahWithNumberOnly = await prisma.quranSurah.createManyAndReturn({ 
     *   select: { number: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuranSurahCreateManyAndReturnArgs>(args?: SelectSubset<T, QuranSurahCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QuranSurah.
     * @param {QuranSurahDeleteArgs} args - Arguments to delete one QuranSurah.
     * @example
     * // Delete one QuranSurah
     * const QuranSurah = await prisma.quranSurah.delete({
     *   where: {
     *     // ... filter to delete one QuranSurah
     *   }
     * })
     * 
     */
    delete<T extends QuranSurahDeleteArgs>(args: SelectSubset<T, QuranSurahDeleteArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QuranSurah.
     * @param {QuranSurahUpdateArgs} args - Arguments to update one QuranSurah.
     * @example
     * // Update one QuranSurah
     * const quranSurah = await prisma.quranSurah.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuranSurahUpdateArgs>(args: SelectSubset<T, QuranSurahUpdateArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QuranSurahs.
     * @param {QuranSurahDeleteManyArgs} args - Arguments to filter QuranSurahs to delete.
     * @example
     * // Delete a few QuranSurahs
     * const { count } = await prisma.quranSurah.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuranSurahDeleteManyArgs>(args?: SelectSubset<T, QuranSurahDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuranSurahs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuranSurahs
     * const quranSurah = await prisma.quranSurah.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuranSurahUpdateManyArgs>(args: SelectSubset<T, QuranSurahUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuranSurah.
     * @param {QuranSurahUpsertArgs} args - Arguments to update or create a QuranSurah.
     * @example
     * // Update or create a QuranSurah
     * const quranSurah = await prisma.quranSurah.upsert({
     *   create: {
     *     // ... data to create a QuranSurah
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuranSurah we want to update
     *   }
     * })
     */
    upsert<T extends QuranSurahUpsertArgs>(args: SelectSubset<T, QuranSurahUpsertArgs<ExtArgs>>): Prisma__QuranSurahClient<$Result.GetResult<Prisma.$QuranSurahPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QuranSurahs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahCountArgs} args - Arguments to filter QuranSurahs to count.
     * @example
     * // Count the number of QuranSurahs
     * const count = await prisma.quranSurah.count({
     *   where: {
     *     // ... the filter for the QuranSurahs we want to count
     *   }
     * })
    **/
    count<T extends QuranSurahCountArgs>(
      args?: Subset<T, QuranSurahCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuranSurahCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuranSurah.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuranSurahAggregateArgs>(args: Subset<T, QuranSurahAggregateArgs>): Prisma.PrismaPromise<GetQuranSurahAggregateType<T>>

    /**
     * Group by QuranSurah.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranSurahGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuranSurahGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuranSurahGroupByArgs['orderBy'] }
        : { orderBy?: QuranSurahGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuranSurahGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuranSurahGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuranSurah model
   */
  readonly fields: QuranSurahFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuranSurah.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuranSurahClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuranSurah model
   */ 
  interface QuranSurahFieldRefs {
    readonly number: FieldRef<"QuranSurah", 'Int'>
    readonly arabicName: FieldRef<"QuranSurah", 'String'>
    readonly transliteration: FieldRef<"QuranSurah", 'String'>
    readonly englishName: FieldRef<"QuranSurah", 'String'>
    readonly ayas: FieldRef<"QuranSurah", 'Int'>
    readonly revelationType: FieldRef<"QuranSurah", 'String'>
    readonly chronologicalOrder: FieldRef<"QuranSurah", 'Int'>
    readonly rukus: FieldRef<"QuranSurah", 'Int'>
    readonly startIndex: FieldRef<"QuranSurah", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * QuranSurah findUnique
   */
  export type QuranSurahFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * Filter, which QuranSurah to fetch.
     */
    where: QuranSurahWhereUniqueInput
  }

  /**
   * QuranSurah findUniqueOrThrow
   */
  export type QuranSurahFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * Filter, which QuranSurah to fetch.
     */
    where: QuranSurahWhereUniqueInput
  }

  /**
   * QuranSurah findFirst
   */
  export type QuranSurahFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * Filter, which QuranSurah to fetch.
     */
    where?: QuranSurahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSurahs to fetch.
     */
    orderBy?: QuranSurahOrderByWithRelationInput | QuranSurahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuranSurahs.
     */
    cursor?: QuranSurahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSurahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSurahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuranSurahs.
     */
    distinct?: QuranSurahScalarFieldEnum | QuranSurahScalarFieldEnum[]
  }

  /**
   * QuranSurah findFirstOrThrow
   */
  export type QuranSurahFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * Filter, which QuranSurah to fetch.
     */
    where?: QuranSurahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSurahs to fetch.
     */
    orderBy?: QuranSurahOrderByWithRelationInput | QuranSurahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuranSurahs.
     */
    cursor?: QuranSurahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSurahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSurahs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuranSurahs.
     */
    distinct?: QuranSurahScalarFieldEnum | QuranSurahScalarFieldEnum[]
  }

  /**
   * QuranSurah findMany
   */
  export type QuranSurahFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * Filter, which QuranSurahs to fetch.
     */
    where?: QuranSurahWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranSurahs to fetch.
     */
    orderBy?: QuranSurahOrderByWithRelationInput | QuranSurahOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuranSurahs.
     */
    cursor?: QuranSurahWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranSurahs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranSurahs.
     */
    skip?: number
    distinct?: QuranSurahScalarFieldEnum | QuranSurahScalarFieldEnum[]
  }

  /**
   * QuranSurah create
   */
  export type QuranSurahCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * The data needed to create a QuranSurah.
     */
    data: XOR<QuranSurahCreateInput, QuranSurahUncheckedCreateInput>
  }

  /**
   * QuranSurah createMany
   */
  export type QuranSurahCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuranSurahs.
     */
    data: QuranSurahCreateManyInput | QuranSurahCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuranSurah createManyAndReturn
   */
  export type QuranSurahCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QuranSurahs.
     */
    data: QuranSurahCreateManyInput | QuranSurahCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuranSurah update
   */
  export type QuranSurahUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * The data needed to update a QuranSurah.
     */
    data: XOR<QuranSurahUpdateInput, QuranSurahUncheckedUpdateInput>
    /**
     * Choose, which QuranSurah to update.
     */
    where: QuranSurahWhereUniqueInput
  }

  /**
   * QuranSurah updateMany
   */
  export type QuranSurahUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuranSurahs.
     */
    data: XOR<QuranSurahUpdateManyMutationInput, QuranSurahUncheckedUpdateManyInput>
    /**
     * Filter which QuranSurahs to update
     */
    where?: QuranSurahWhereInput
  }

  /**
   * QuranSurah upsert
   */
  export type QuranSurahUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * The filter to search for the QuranSurah to update in case it exists.
     */
    where: QuranSurahWhereUniqueInput
    /**
     * In case the QuranSurah found by the `where` argument doesn't exist, create a new QuranSurah with this data.
     */
    create: XOR<QuranSurahCreateInput, QuranSurahUncheckedCreateInput>
    /**
     * In case the QuranSurah was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuranSurahUpdateInput, QuranSurahUncheckedUpdateInput>
  }

  /**
   * QuranSurah delete
   */
  export type QuranSurahDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
    /**
     * Filter which QuranSurah to delete.
     */
    where: QuranSurahWhereUniqueInput
  }

  /**
   * QuranSurah deleteMany
   */
  export type QuranSurahDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuranSurahs to delete
     */
    where?: QuranSurahWhereInput
  }

  /**
   * QuranSurah without action
   */
  export type QuranSurahDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranSurah
     */
    select?: QuranSurahSelect<ExtArgs> | null
  }


  /**
   * Model QuranText
   */

  export type AggregateQuranText = {
    _count: QuranTextCountAggregateOutputType | null
    _avg: QuranTextAvgAggregateOutputType | null
    _sum: QuranTextSumAggregateOutputType | null
    _min: QuranTextMinAggregateOutputType | null
    _max: QuranTextMaxAggregateOutputType | null
  }

  export type QuranTextAvgAggregateOutputType = {
    id: number | null
    sura: number | null
    aya: number | null
  }

  export type QuranTextSumAggregateOutputType = {
    id: number | null
    sura: number | null
    aya: number | null
  }

  export type QuranTextMinAggregateOutputType = {
    id: number | null
    sura: number | null
    aya: number | null
    text: string | null
  }

  export type QuranTextMaxAggregateOutputType = {
    id: number | null
    sura: number | null
    aya: number | null
    text: string | null
  }

  export type QuranTextCountAggregateOutputType = {
    id: number
    sura: number
    aya: number
    text: number
    _all: number
  }


  export type QuranTextAvgAggregateInputType = {
    id?: true
    sura?: true
    aya?: true
  }

  export type QuranTextSumAggregateInputType = {
    id?: true
    sura?: true
    aya?: true
  }

  export type QuranTextMinAggregateInputType = {
    id?: true
    sura?: true
    aya?: true
    text?: true
  }

  export type QuranTextMaxAggregateInputType = {
    id?: true
    sura?: true
    aya?: true
    text?: true
  }

  export type QuranTextCountAggregateInputType = {
    id?: true
    sura?: true
    aya?: true
    text?: true
    _all?: true
  }

  export type QuranTextAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuranText to aggregate.
     */
    where?: QuranTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranTexts to fetch.
     */
    orderBy?: QuranTextOrderByWithRelationInput | QuranTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuranTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranTexts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuranTexts
    **/
    _count?: true | QuranTextCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuranTextAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuranTextSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuranTextMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuranTextMaxAggregateInputType
  }

  export type GetQuranTextAggregateType<T extends QuranTextAggregateArgs> = {
        [P in keyof T & keyof AggregateQuranText]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuranText[P]>
      : GetScalarType<T[P], AggregateQuranText[P]>
  }




  export type QuranTextGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuranTextWhereInput
    orderBy?: QuranTextOrderByWithAggregationInput | QuranTextOrderByWithAggregationInput[]
    by: QuranTextScalarFieldEnum[] | QuranTextScalarFieldEnum
    having?: QuranTextScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuranTextCountAggregateInputType | true
    _avg?: QuranTextAvgAggregateInputType
    _sum?: QuranTextSumAggregateInputType
    _min?: QuranTextMinAggregateInputType
    _max?: QuranTextMaxAggregateInputType
  }

  export type QuranTextGroupByOutputType = {
    id: number
    sura: number
    aya: number
    text: string
    _count: QuranTextCountAggregateOutputType | null
    _avg: QuranTextAvgAggregateOutputType | null
    _sum: QuranTextSumAggregateOutputType | null
    _min: QuranTextMinAggregateOutputType | null
    _max: QuranTextMaxAggregateOutputType | null
  }

  type GetQuranTextGroupByPayload<T extends QuranTextGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuranTextGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuranTextGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuranTextGroupByOutputType[P]>
            : GetScalarType<T[P], QuranTextGroupByOutputType[P]>
        }
      >
    >


  export type QuranTextSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sura?: boolean
    aya?: boolean
    text?: boolean
  }, ExtArgs["result"]["quranText"]>

  export type QuranTextSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sura?: boolean
    aya?: boolean
    text?: boolean
  }, ExtArgs["result"]["quranText"]>

  export type QuranTextSelectScalar = {
    id?: boolean
    sura?: boolean
    aya?: boolean
    text?: boolean
  }


  export type $QuranTextPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuranText"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      sura: number
      aya: number
      text: string
    }, ExtArgs["result"]["quranText"]>
    composites: {}
  }

  type QuranTextGetPayload<S extends boolean | null | undefined | QuranTextDefaultArgs> = $Result.GetResult<Prisma.$QuranTextPayload, S>

  type QuranTextCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QuranTextFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QuranTextCountAggregateInputType | true
    }

  export interface QuranTextDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuranText'], meta: { name: 'QuranText' } }
    /**
     * Find zero or one QuranText that matches the filter.
     * @param {QuranTextFindUniqueArgs} args - Arguments to find a QuranText
     * @example
     * // Get one QuranText
     * const quranText = await prisma.quranText.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuranTextFindUniqueArgs>(args: SelectSubset<T, QuranTextFindUniqueArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QuranText that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QuranTextFindUniqueOrThrowArgs} args - Arguments to find a QuranText
     * @example
     * // Get one QuranText
     * const quranText = await prisma.quranText.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuranTextFindUniqueOrThrowArgs>(args: SelectSubset<T, QuranTextFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QuranText that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextFindFirstArgs} args - Arguments to find a QuranText
     * @example
     * // Get one QuranText
     * const quranText = await prisma.quranText.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuranTextFindFirstArgs>(args?: SelectSubset<T, QuranTextFindFirstArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QuranText that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextFindFirstOrThrowArgs} args - Arguments to find a QuranText
     * @example
     * // Get one QuranText
     * const quranText = await prisma.quranText.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuranTextFindFirstOrThrowArgs>(args?: SelectSubset<T, QuranTextFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QuranTexts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuranTexts
     * const quranTexts = await prisma.quranText.findMany()
     * 
     * // Get first 10 QuranTexts
     * const quranTexts = await prisma.quranText.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const quranTextWithIdOnly = await prisma.quranText.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuranTextFindManyArgs>(args?: SelectSubset<T, QuranTextFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QuranText.
     * @param {QuranTextCreateArgs} args - Arguments to create a QuranText.
     * @example
     * // Create one QuranText
     * const QuranText = await prisma.quranText.create({
     *   data: {
     *     // ... data to create a QuranText
     *   }
     * })
     * 
     */
    create<T extends QuranTextCreateArgs>(args: SelectSubset<T, QuranTextCreateArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QuranTexts.
     * @param {QuranTextCreateManyArgs} args - Arguments to create many QuranTexts.
     * @example
     * // Create many QuranTexts
     * const quranText = await prisma.quranText.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuranTextCreateManyArgs>(args?: SelectSubset<T, QuranTextCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuranTexts and returns the data saved in the database.
     * @param {QuranTextCreateManyAndReturnArgs} args - Arguments to create many QuranTexts.
     * @example
     * // Create many QuranTexts
     * const quranText = await prisma.quranText.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuranTexts and only return the `id`
     * const quranTextWithIdOnly = await prisma.quranText.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuranTextCreateManyAndReturnArgs>(args?: SelectSubset<T, QuranTextCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QuranText.
     * @param {QuranTextDeleteArgs} args - Arguments to delete one QuranText.
     * @example
     * // Delete one QuranText
     * const QuranText = await prisma.quranText.delete({
     *   where: {
     *     // ... filter to delete one QuranText
     *   }
     * })
     * 
     */
    delete<T extends QuranTextDeleteArgs>(args: SelectSubset<T, QuranTextDeleteArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QuranText.
     * @param {QuranTextUpdateArgs} args - Arguments to update one QuranText.
     * @example
     * // Update one QuranText
     * const quranText = await prisma.quranText.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuranTextUpdateArgs>(args: SelectSubset<T, QuranTextUpdateArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QuranTexts.
     * @param {QuranTextDeleteManyArgs} args - Arguments to filter QuranTexts to delete.
     * @example
     * // Delete a few QuranTexts
     * const { count } = await prisma.quranText.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuranTextDeleteManyArgs>(args?: SelectSubset<T, QuranTextDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuranTexts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuranTexts
     * const quranText = await prisma.quranText.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuranTextUpdateManyArgs>(args: SelectSubset<T, QuranTextUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QuranText.
     * @param {QuranTextUpsertArgs} args - Arguments to update or create a QuranText.
     * @example
     * // Update or create a QuranText
     * const quranText = await prisma.quranText.upsert({
     *   create: {
     *     // ... data to create a QuranText
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuranText we want to update
     *   }
     * })
     */
    upsert<T extends QuranTextUpsertArgs>(args: SelectSubset<T, QuranTextUpsertArgs<ExtArgs>>): Prisma__QuranTextClient<$Result.GetResult<Prisma.$QuranTextPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QuranTexts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextCountArgs} args - Arguments to filter QuranTexts to count.
     * @example
     * // Count the number of QuranTexts
     * const count = await prisma.quranText.count({
     *   where: {
     *     // ... the filter for the QuranTexts we want to count
     *   }
     * })
    **/
    count<T extends QuranTextCountArgs>(
      args?: Subset<T, QuranTextCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuranTextCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuranText.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QuranTextAggregateArgs>(args: Subset<T, QuranTextAggregateArgs>): Prisma.PrismaPromise<GetQuranTextAggregateType<T>>

    /**
     * Group by QuranText.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuranTextGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QuranTextGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuranTextGroupByArgs['orderBy'] }
        : { orderBy?: QuranTextGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QuranTextGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuranTextGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuranText model
   */
  readonly fields: QuranTextFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuranText.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuranTextClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QuranText model
   */ 
  interface QuranTextFieldRefs {
    readonly id: FieldRef<"QuranText", 'Int'>
    readonly sura: FieldRef<"QuranText", 'Int'>
    readonly aya: FieldRef<"QuranText", 'Int'>
    readonly text: FieldRef<"QuranText", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QuranText findUnique
   */
  export type QuranTextFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * Filter, which QuranText to fetch.
     */
    where: QuranTextWhereUniqueInput
  }

  /**
   * QuranText findUniqueOrThrow
   */
  export type QuranTextFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * Filter, which QuranText to fetch.
     */
    where: QuranTextWhereUniqueInput
  }

  /**
   * QuranText findFirst
   */
  export type QuranTextFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * Filter, which QuranText to fetch.
     */
    where?: QuranTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranTexts to fetch.
     */
    orderBy?: QuranTextOrderByWithRelationInput | QuranTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuranTexts.
     */
    cursor?: QuranTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranTexts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuranTexts.
     */
    distinct?: QuranTextScalarFieldEnum | QuranTextScalarFieldEnum[]
  }

  /**
   * QuranText findFirstOrThrow
   */
  export type QuranTextFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * Filter, which QuranText to fetch.
     */
    where?: QuranTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranTexts to fetch.
     */
    orderBy?: QuranTextOrderByWithRelationInput | QuranTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuranTexts.
     */
    cursor?: QuranTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranTexts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuranTexts.
     */
    distinct?: QuranTextScalarFieldEnum | QuranTextScalarFieldEnum[]
  }

  /**
   * QuranText findMany
   */
  export type QuranTextFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * Filter, which QuranTexts to fetch.
     */
    where?: QuranTextWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuranTexts to fetch.
     */
    orderBy?: QuranTextOrderByWithRelationInput | QuranTextOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuranTexts.
     */
    cursor?: QuranTextWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuranTexts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuranTexts.
     */
    skip?: number
    distinct?: QuranTextScalarFieldEnum | QuranTextScalarFieldEnum[]
  }

  /**
   * QuranText create
   */
  export type QuranTextCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * The data needed to create a QuranText.
     */
    data: XOR<QuranTextCreateInput, QuranTextUncheckedCreateInput>
  }

  /**
   * QuranText createMany
   */
  export type QuranTextCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuranTexts.
     */
    data: QuranTextCreateManyInput | QuranTextCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuranText createManyAndReturn
   */
  export type QuranTextCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QuranTexts.
     */
    data: QuranTextCreateManyInput | QuranTextCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuranText update
   */
  export type QuranTextUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * The data needed to update a QuranText.
     */
    data: XOR<QuranTextUpdateInput, QuranTextUncheckedUpdateInput>
    /**
     * Choose, which QuranText to update.
     */
    where: QuranTextWhereUniqueInput
  }

  /**
   * QuranText updateMany
   */
  export type QuranTextUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuranTexts.
     */
    data: XOR<QuranTextUpdateManyMutationInput, QuranTextUncheckedUpdateManyInput>
    /**
     * Filter which QuranTexts to update
     */
    where?: QuranTextWhereInput
  }

  /**
   * QuranText upsert
   */
  export type QuranTextUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * The filter to search for the QuranText to update in case it exists.
     */
    where: QuranTextWhereUniqueInput
    /**
     * In case the QuranText found by the `where` argument doesn't exist, create a new QuranText with this data.
     */
    create: XOR<QuranTextCreateInput, QuranTextUncheckedCreateInput>
    /**
     * In case the QuranText was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuranTextUpdateInput, QuranTextUncheckedUpdateInput>
  }

  /**
   * QuranText delete
   */
  export type QuranTextDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
    /**
     * Filter which QuranText to delete.
     */
    where: QuranTextWhereUniqueInput
  }

  /**
   * QuranText deleteMany
   */
  export type QuranTextDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuranTexts to delete
     */
    where?: QuranTextWhereInput
  }

  /**
   * QuranText without action
   */
  export type QuranTextDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuranText
     */
    select?: QuranTextSelect<ExtArgs> | null
  }


  /**
   * Model UserBookmark
   */

  export type AggregateUserBookmark = {
    _count: UserBookmarkCountAggregateOutputType | null
    _avg: UserBookmarkAvgAggregateOutputType | null
    _sum: UserBookmarkSumAggregateOutputType | null
    _min: UserBookmarkMinAggregateOutputType | null
    _max: UserBookmarkMaxAggregateOutputType | null
  }

  export type UserBookmarkAvgAggregateOutputType = {
    surahId: number | null
    verseNumber: number | null
  }

  export type UserBookmarkSumAggregateOutputType = {
    surahId: number | null
    verseNumber: number | null
  }

  export type UserBookmarkMinAggregateOutputType = {
    id: string | null
    userId: string | null
    surahId: number | null
    verseNumber: number | null
    verseText: string | null
    surahName: string | null
    translation: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserBookmarkMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    surahId: number | null
    verseNumber: number | null
    verseText: string | null
    surahName: string | null
    translation: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserBookmarkCountAggregateOutputType = {
    id: number
    userId: number
    surahId: number
    verseNumber: number
    verseText: number
    surahName: number
    translation: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserBookmarkAvgAggregateInputType = {
    surahId?: true
    verseNumber?: true
  }

  export type UserBookmarkSumAggregateInputType = {
    surahId?: true
    verseNumber?: true
  }

  export type UserBookmarkMinAggregateInputType = {
    id?: true
    userId?: true
    surahId?: true
    verseNumber?: true
    verseText?: true
    surahName?: true
    translation?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserBookmarkMaxAggregateInputType = {
    id?: true
    userId?: true
    surahId?: true
    verseNumber?: true
    verseText?: true
    surahName?: true
    translation?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserBookmarkCountAggregateInputType = {
    id?: true
    userId?: true
    surahId?: true
    verseNumber?: true
    verseText?: true
    surahName?: true
    translation?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserBookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBookmark to aggregate.
     */
    where?: UserBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBookmarks to fetch.
     */
    orderBy?: UserBookmarkOrderByWithRelationInput | UserBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserBookmarks
    **/
    _count?: true | UserBookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserBookmarkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserBookmarkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserBookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserBookmarkMaxAggregateInputType
  }

  export type GetUserBookmarkAggregateType<T extends UserBookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateUserBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserBookmark[P]>
      : GetScalarType<T[P], AggregateUserBookmark[P]>
  }




  export type UserBookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBookmarkWhereInput
    orderBy?: UserBookmarkOrderByWithAggregationInput | UserBookmarkOrderByWithAggregationInput[]
    by: UserBookmarkScalarFieldEnum[] | UserBookmarkScalarFieldEnum
    having?: UserBookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserBookmarkCountAggregateInputType | true
    _avg?: UserBookmarkAvgAggregateInputType
    _sum?: UserBookmarkSumAggregateInputType
    _min?: UserBookmarkMinAggregateInputType
    _max?: UserBookmarkMaxAggregateInputType
  }

  export type UserBookmarkGroupByOutputType = {
    id: string
    userId: string
    surahId: number
    verseNumber: number
    verseText: string
    surahName: string
    translation: string
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserBookmarkCountAggregateOutputType | null
    _avg: UserBookmarkAvgAggregateOutputType | null
    _sum: UserBookmarkSumAggregateOutputType | null
    _min: UserBookmarkMinAggregateOutputType | null
    _max: UserBookmarkMaxAggregateOutputType | null
  }

  type GetUserBookmarkGroupByPayload<T extends UserBookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserBookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserBookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserBookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], UserBookmarkGroupByOutputType[P]>
        }
      >
    >


  export type UserBookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    surahId?: boolean
    verseNumber?: boolean
    verseText?: boolean
    surahName?: boolean
    translation?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userBookmark"]>

  export type UserBookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    surahId?: boolean
    verseNumber?: boolean
    verseText?: boolean
    surahName?: boolean
    translation?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userBookmark"]>

  export type UserBookmarkSelectScalar = {
    id?: boolean
    userId?: boolean
    surahId?: boolean
    verseNumber?: boolean
    verseText?: boolean
    surahName?: boolean
    translation?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $UserBookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserBookmark"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      surahId: number
      verseNumber: number
      verseText: string
      surahName: string
      translation: string
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userBookmark"]>
    composites: {}
  }

  type UserBookmarkGetPayload<S extends boolean | null | undefined | UserBookmarkDefaultArgs> = $Result.GetResult<Prisma.$UserBookmarkPayload, S>

  type UserBookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserBookmarkFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserBookmarkCountAggregateInputType | true
    }

  export interface UserBookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserBookmark'], meta: { name: 'UserBookmark' } }
    /**
     * Find zero or one UserBookmark that matches the filter.
     * @param {UserBookmarkFindUniqueArgs} args - Arguments to find a UserBookmark
     * @example
     * // Get one UserBookmark
     * const userBookmark = await prisma.userBookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserBookmarkFindUniqueArgs>(args: SelectSubset<T, UserBookmarkFindUniqueArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserBookmark that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserBookmarkFindUniqueOrThrowArgs} args - Arguments to find a UserBookmark
     * @example
     * // Get one UserBookmark
     * const userBookmark = await prisma.userBookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserBookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, UserBookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserBookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkFindFirstArgs} args - Arguments to find a UserBookmark
     * @example
     * // Get one UserBookmark
     * const userBookmark = await prisma.userBookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserBookmarkFindFirstArgs>(args?: SelectSubset<T, UserBookmarkFindFirstArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserBookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkFindFirstOrThrowArgs} args - Arguments to find a UserBookmark
     * @example
     * // Get one UserBookmark
     * const userBookmark = await prisma.userBookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserBookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, UserBookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserBookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserBookmarks
     * const userBookmarks = await prisma.userBookmark.findMany()
     * 
     * // Get first 10 UserBookmarks
     * const userBookmarks = await prisma.userBookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userBookmarkWithIdOnly = await prisma.userBookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserBookmarkFindManyArgs>(args?: SelectSubset<T, UserBookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserBookmark.
     * @param {UserBookmarkCreateArgs} args - Arguments to create a UserBookmark.
     * @example
     * // Create one UserBookmark
     * const UserBookmark = await prisma.userBookmark.create({
     *   data: {
     *     // ... data to create a UserBookmark
     *   }
     * })
     * 
     */
    create<T extends UserBookmarkCreateArgs>(args: SelectSubset<T, UserBookmarkCreateArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserBookmarks.
     * @param {UserBookmarkCreateManyArgs} args - Arguments to create many UserBookmarks.
     * @example
     * // Create many UserBookmarks
     * const userBookmark = await prisma.userBookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserBookmarkCreateManyArgs>(args?: SelectSubset<T, UserBookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserBookmarks and returns the data saved in the database.
     * @param {UserBookmarkCreateManyAndReturnArgs} args - Arguments to create many UserBookmarks.
     * @example
     * // Create many UserBookmarks
     * const userBookmark = await prisma.userBookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserBookmarks and only return the `id`
     * const userBookmarkWithIdOnly = await prisma.userBookmark.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserBookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, UserBookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserBookmark.
     * @param {UserBookmarkDeleteArgs} args - Arguments to delete one UserBookmark.
     * @example
     * // Delete one UserBookmark
     * const UserBookmark = await prisma.userBookmark.delete({
     *   where: {
     *     // ... filter to delete one UserBookmark
     *   }
     * })
     * 
     */
    delete<T extends UserBookmarkDeleteArgs>(args: SelectSubset<T, UserBookmarkDeleteArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserBookmark.
     * @param {UserBookmarkUpdateArgs} args - Arguments to update one UserBookmark.
     * @example
     * // Update one UserBookmark
     * const userBookmark = await prisma.userBookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserBookmarkUpdateArgs>(args: SelectSubset<T, UserBookmarkUpdateArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserBookmarks.
     * @param {UserBookmarkDeleteManyArgs} args - Arguments to filter UserBookmarks to delete.
     * @example
     * // Delete a few UserBookmarks
     * const { count } = await prisma.userBookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserBookmarkDeleteManyArgs>(args?: SelectSubset<T, UserBookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserBookmarks
     * const userBookmark = await prisma.userBookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserBookmarkUpdateManyArgs>(args: SelectSubset<T, UserBookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserBookmark.
     * @param {UserBookmarkUpsertArgs} args - Arguments to update or create a UserBookmark.
     * @example
     * // Update or create a UserBookmark
     * const userBookmark = await prisma.userBookmark.upsert({
     *   create: {
     *     // ... data to create a UserBookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserBookmark we want to update
     *   }
     * })
     */
    upsert<T extends UserBookmarkUpsertArgs>(args: SelectSubset<T, UserBookmarkUpsertArgs<ExtArgs>>): Prisma__UserBookmarkClient<$Result.GetResult<Prisma.$UserBookmarkPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkCountArgs} args - Arguments to filter UserBookmarks to count.
     * @example
     * // Count the number of UserBookmarks
     * const count = await prisma.userBookmark.count({
     *   where: {
     *     // ... the filter for the UserBookmarks we want to count
     *   }
     * })
    **/
    count<T extends UserBookmarkCountArgs>(
      args?: Subset<T, UserBookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserBookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserBookmarkAggregateArgs>(args: Subset<T, UserBookmarkAggregateArgs>): Prisma.PrismaPromise<GetUserBookmarkAggregateType<T>>

    /**
     * Group by UserBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBookmarkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserBookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserBookmarkGroupByArgs['orderBy'] }
        : { orderBy?: UserBookmarkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserBookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserBookmark model
   */
  readonly fields: UserBookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserBookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserBookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserBookmark model
   */ 
  interface UserBookmarkFieldRefs {
    readonly id: FieldRef<"UserBookmark", 'String'>
    readonly userId: FieldRef<"UserBookmark", 'String'>
    readonly surahId: FieldRef<"UserBookmark", 'Int'>
    readonly verseNumber: FieldRef<"UserBookmark", 'Int'>
    readonly verseText: FieldRef<"UserBookmark", 'String'>
    readonly surahName: FieldRef<"UserBookmark", 'String'>
    readonly translation: FieldRef<"UserBookmark", 'String'>
    readonly notes: FieldRef<"UserBookmark", 'String'>
    readonly createdAt: FieldRef<"UserBookmark", 'DateTime'>
    readonly updatedAt: FieldRef<"UserBookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserBookmark findUnique
   */
  export type UserBookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which UserBookmark to fetch.
     */
    where: UserBookmarkWhereUniqueInput
  }

  /**
   * UserBookmark findUniqueOrThrow
   */
  export type UserBookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which UserBookmark to fetch.
     */
    where: UserBookmarkWhereUniqueInput
  }

  /**
   * UserBookmark findFirst
   */
  export type UserBookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which UserBookmark to fetch.
     */
    where?: UserBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBookmarks to fetch.
     */
    orderBy?: UserBookmarkOrderByWithRelationInput | UserBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBookmarks.
     */
    cursor?: UserBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBookmarks.
     */
    distinct?: UserBookmarkScalarFieldEnum | UserBookmarkScalarFieldEnum[]
  }

  /**
   * UserBookmark findFirstOrThrow
   */
  export type UserBookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which UserBookmark to fetch.
     */
    where?: UserBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBookmarks to fetch.
     */
    orderBy?: UserBookmarkOrderByWithRelationInput | UserBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBookmarks.
     */
    cursor?: UserBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBookmarks.
     */
    distinct?: UserBookmarkScalarFieldEnum | UserBookmarkScalarFieldEnum[]
  }

  /**
   * UserBookmark findMany
   */
  export type UserBookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * Filter, which UserBookmarks to fetch.
     */
    where?: UserBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBookmarks to fetch.
     */
    orderBy?: UserBookmarkOrderByWithRelationInput | UserBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserBookmarks.
     */
    cursor?: UserBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBookmarks.
     */
    skip?: number
    distinct?: UserBookmarkScalarFieldEnum | UserBookmarkScalarFieldEnum[]
  }

  /**
   * UserBookmark create
   */
  export type UserBookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * The data needed to create a UserBookmark.
     */
    data: XOR<UserBookmarkCreateInput, UserBookmarkUncheckedCreateInput>
  }

  /**
   * UserBookmark createMany
   */
  export type UserBookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserBookmarks.
     */
    data: UserBookmarkCreateManyInput | UserBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserBookmark createManyAndReturn
   */
  export type UserBookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserBookmarks.
     */
    data: UserBookmarkCreateManyInput | UserBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserBookmark update
   */
  export type UserBookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * The data needed to update a UserBookmark.
     */
    data: XOR<UserBookmarkUpdateInput, UserBookmarkUncheckedUpdateInput>
    /**
     * Choose, which UserBookmark to update.
     */
    where: UserBookmarkWhereUniqueInput
  }

  /**
   * UserBookmark updateMany
   */
  export type UserBookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserBookmarks.
     */
    data: XOR<UserBookmarkUpdateManyMutationInput, UserBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which UserBookmarks to update
     */
    where?: UserBookmarkWhereInput
  }

  /**
   * UserBookmark upsert
   */
  export type UserBookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * The filter to search for the UserBookmark to update in case it exists.
     */
    where: UserBookmarkWhereUniqueInput
    /**
     * In case the UserBookmark found by the `where` argument doesn't exist, create a new UserBookmark with this data.
     */
    create: XOR<UserBookmarkCreateInput, UserBookmarkUncheckedCreateInput>
    /**
     * In case the UserBookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserBookmarkUpdateInput, UserBookmarkUncheckedUpdateInput>
  }

  /**
   * UserBookmark delete
   */
  export type UserBookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
    /**
     * Filter which UserBookmark to delete.
     */
    where: UserBookmarkWhereUniqueInput
  }

  /**
   * UserBookmark deleteMany
   */
  export type UserBookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBookmarks to delete
     */
    where?: UserBookmarkWhereInput
  }

  /**
   * UserBookmark without action
   */
  export type UserBookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBookmark
     */
    select?: UserBookmarkSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const EnYusufaliScalarFieldEnum: {
    index: 'index',
    sura: 'sura',
    aya: 'aya',
    text: 'text'
  };

  export type EnYusufaliScalarFieldEnum = (typeof EnYusufaliScalarFieldEnum)[keyof typeof EnYusufaliScalarFieldEnum]


  export const QuranSajdaScalarFieldEnum: {
    sajdaId: 'sajdaId',
    surahNumber: 'surahNumber',
    ayahNumber: 'ayahNumber',
    type: 'type'
  };

  export type QuranSajdaScalarFieldEnum = (typeof QuranSajdaScalarFieldEnum)[keyof typeof QuranSajdaScalarFieldEnum]


  export const QuranSurahScalarFieldEnum: {
    number: 'number',
    arabicName: 'arabicName',
    transliteration: 'transliteration',
    englishName: 'englishName',
    ayas: 'ayas',
    revelationType: 'revelationType',
    chronologicalOrder: 'chronologicalOrder',
    rukus: 'rukus',
    startIndex: 'startIndex'
  };

  export type QuranSurahScalarFieldEnum = (typeof QuranSurahScalarFieldEnum)[keyof typeof QuranSurahScalarFieldEnum]


  export const QuranTextScalarFieldEnum: {
    id: 'id',
    sura: 'sura',
    aya: 'aya',
    text: 'text'
  };

  export type QuranTextScalarFieldEnum = (typeof QuranTextScalarFieldEnum)[keyof typeof QuranTextScalarFieldEnum]


  export const UserBookmarkScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    surahId: 'surahId',
    verseNumber: 'verseNumber',
    verseText: 'verseText',
    surahName: 'surahName',
    translation: 'translation',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserBookmarkScalarFieldEnum = (typeof UserBookmarkScalarFieldEnum)[keyof typeof UserBookmarkScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type EnYusufaliWhereInput = {
    AND?: EnYusufaliWhereInput | EnYusufaliWhereInput[]
    OR?: EnYusufaliWhereInput[]
    NOT?: EnYusufaliWhereInput | EnYusufaliWhereInput[]
    index?: IntFilter<"EnYusufali"> | number
    sura?: IntFilter<"EnYusufali"> | number
    aya?: IntFilter<"EnYusufali"> | number
    text?: StringFilter<"EnYusufali"> | string
  }

  export type EnYusufaliOrderByWithRelationInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type EnYusufaliWhereUniqueInput = Prisma.AtLeast<{
    index?: number
    AND?: EnYusufaliWhereInput | EnYusufaliWhereInput[]
    OR?: EnYusufaliWhereInput[]
    NOT?: EnYusufaliWhereInput | EnYusufaliWhereInput[]
    sura?: IntFilter<"EnYusufali"> | number
    aya?: IntFilter<"EnYusufali"> | number
    text?: StringFilter<"EnYusufali"> | string
  }, "index">

  export type EnYusufaliOrderByWithAggregationInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
    _count?: EnYusufaliCountOrderByAggregateInput
    _avg?: EnYusufaliAvgOrderByAggregateInput
    _max?: EnYusufaliMaxOrderByAggregateInput
    _min?: EnYusufaliMinOrderByAggregateInput
    _sum?: EnYusufaliSumOrderByAggregateInput
  }

  export type EnYusufaliScalarWhereWithAggregatesInput = {
    AND?: EnYusufaliScalarWhereWithAggregatesInput | EnYusufaliScalarWhereWithAggregatesInput[]
    OR?: EnYusufaliScalarWhereWithAggregatesInput[]
    NOT?: EnYusufaliScalarWhereWithAggregatesInput | EnYusufaliScalarWhereWithAggregatesInput[]
    index?: IntWithAggregatesFilter<"EnYusufali"> | number
    sura?: IntWithAggregatesFilter<"EnYusufali"> | number
    aya?: IntWithAggregatesFilter<"EnYusufali"> | number
    text?: StringWithAggregatesFilter<"EnYusufali"> | string
  }

  export type QuranSajdaWhereInput = {
    AND?: QuranSajdaWhereInput | QuranSajdaWhereInput[]
    OR?: QuranSajdaWhereInput[]
    NOT?: QuranSajdaWhereInput | QuranSajdaWhereInput[]
    sajdaId?: IntFilter<"QuranSajda"> | number
    surahNumber?: IntFilter<"QuranSajda"> | number
    ayahNumber?: IntFilter<"QuranSajda"> | number
    type?: StringNullableFilter<"QuranSajda"> | string | null
  }

  export type QuranSajdaOrderByWithRelationInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
    type?: SortOrderInput | SortOrder
  }

  export type QuranSajdaWhereUniqueInput = Prisma.AtLeast<{
    sajdaId?: number
    AND?: QuranSajdaWhereInput | QuranSajdaWhereInput[]
    OR?: QuranSajdaWhereInput[]
    NOT?: QuranSajdaWhereInput | QuranSajdaWhereInput[]
    surahNumber?: IntFilter<"QuranSajda"> | number
    ayahNumber?: IntFilter<"QuranSajda"> | number
    type?: StringNullableFilter<"QuranSajda"> | string | null
  }, "sajdaId">

  export type QuranSajdaOrderByWithAggregationInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
    type?: SortOrderInput | SortOrder
    _count?: QuranSajdaCountOrderByAggregateInput
    _avg?: QuranSajdaAvgOrderByAggregateInput
    _max?: QuranSajdaMaxOrderByAggregateInput
    _min?: QuranSajdaMinOrderByAggregateInput
    _sum?: QuranSajdaSumOrderByAggregateInput
  }

  export type QuranSajdaScalarWhereWithAggregatesInput = {
    AND?: QuranSajdaScalarWhereWithAggregatesInput | QuranSajdaScalarWhereWithAggregatesInput[]
    OR?: QuranSajdaScalarWhereWithAggregatesInput[]
    NOT?: QuranSajdaScalarWhereWithAggregatesInput | QuranSajdaScalarWhereWithAggregatesInput[]
    sajdaId?: IntWithAggregatesFilter<"QuranSajda"> | number
    surahNumber?: IntWithAggregatesFilter<"QuranSajda"> | number
    ayahNumber?: IntWithAggregatesFilter<"QuranSajda"> | number
    type?: StringNullableWithAggregatesFilter<"QuranSajda"> | string | null
  }

  export type QuranSurahWhereInput = {
    AND?: QuranSurahWhereInput | QuranSurahWhereInput[]
    OR?: QuranSurahWhereInput[]
    NOT?: QuranSurahWhereInput | QuranSurahWhereInput[]
    number?: IntFilter<"QuranSurah"> | number
    arabicName?: StringFilter<"QuranSurah"> | string
    transliteration?: StringFilter<"QuranSurah"> | string
    englishName?: StringFilter<"QuranSurah"> | string
    ayas?: IntFilter<"QuranSurah"> | number
    revelationType?: StringFilter<"QuranSurah"> | string
    chronologicalOrder?: IntFilter<"QuranSurah"> | number
    rukus?: IntFilter<"QuranSurah"> | number
    startIndex?: IntNullableFilter<"QuranSurah"> | number | null
  }

  export type QuranSurahOrderByWithRelationInput = {
    number?: SortOrder
    arabicName?: SortOrder
    transliteration?: SortOrder
    englishName?: SortOrder
    ayas?: SortOrder
    revelationType?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrderInput | SortOrder
  }

  export type QuranSurahWhereUniqueInput = Prisma.AtLeast<{
    number?: number
    AND?: QuranSurahWhereInput | QuranSurahWhereInput[]
    OR?: QuranSurahWhereInput[]
    NOT?: QuranSurahWhereInput | QuranSurahWhereInput[]
    arabicName?: StringFilter<"QuranSurah"> | string
    transliteration?: StringFilter<"QuranSurah"> | string
    englishName?: StringFilter<"QuranSurah"> | string
    ayas?: IntFilter<"QuranSurah"> | number
    revelationType?: StringFilter<"QuranSurah"> | string
    chronologicalOrder?: IntFilter<"QuranSurah"> | number
    rukus?: IntFilter<"QuranSurah"> | number
    startIndex?: IntNullableFilter<"QuranSurah"> | number | null
  }, "number">

  export type QuranSurahOrderByWithAggregationInput = {
    number?: SortOrder
    arabicName?: SortOrder
    transliteration?: SortOrder
    englishName?: SortOrder
    ayas?: SortOrder
    revelationType?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrderInput | SortOrder
    _count?: QuranSurahCountOrderByAggregateInput
    _avg?: QuranSurahAvgOrderByAggregateInput
    _max?: QuranSurahMaxOrderByAggregateInput
    _min?: QuranSurahMinOrderByAggregateInput
    _sum?: QuranSurahSumOrderByAggregateInput
  }

  export type QuranSurahScalarWhereWithAggregatesInput = {
    AND?: QuranSurahScalarWhereWithAggregatesInput | QuranSurahScalarWhereWithAggregatesInput[]
    OR?: QuranSurahScalarWhereWithAggregatesInput[]
    NOT?: QuranSurahScalarWhereWithAggregatesInput | QuranSurahScalarWhereWithAggregatesInput[]
    number?: IntWithAggregatesFilter<"QuranSurah"> | number
    arabicName?: StringWithAggregatesFilter<"QuranSurah"> | string
    transliteration?: StringWithAggregatesFilter<"QuranSurah"> | string
    englishName?: StringWithAggregatesFilter<"QuranSurah"> | string
    ayas?: IntWithAggregatesFilter<"QuranSurah"> | number
    revelationType?: StringWithAggregatesFilter<"QuranSurah"> | string
    chronologicalOrder?: IntWithAggregatesFilter<"QuranSurah"> | number
    rukus?: IntWithAggregatesFilter<"QuranSurah"> | number
    startIndex?: IntNullableWithAggregatesFilter<"QuranSurah"> | number | null
  }

  export type QuranTextWhereInput = {
    AND?: QuranTextWhereInput | QuranTextWhereInput[]
    OR?: QuranTextWhereInput[]
    NOT?: QuranTextWhereInput | QuranTextWhereInput[]
    id?: IntFilter<"QuranText"> | number
    sura?: IntFilter<"QuranText"> | number
    aya?: IntFilter<"QuranText"> | number
    text?: StringFilter<"QuranText"> | string
  }

  export type QuranTextOrderByWithRelationInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type QuranTextWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: QuranTextWhereInput | QuranTextWhereInput[]
    OR?: QuranTextWhereInput[]
    NOT?: QuranTextWhereInput | QuranTextWhereInput[]
    sura?: IntFilter<"QuranText"> | number
    aya?: IntFilter<"QuranText"> | number
    text?: StringFilter<"QuranText"> | string
  }, "id">

  export type QuranTextOrderByWithAggregationInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
    _count?: QuranTextCountOrderByAggregateInput
    _avg?: QuranTextAvgOrderByAggregateInput
    _max?: QuranTextMaxOrderByAggregateInput
    _min?: QuranTextMinOrderByAggregateInput
    _sum?: QuranTextSumOrderByAggregateInput
  }

  export type QuranTextScalarWhereWithAggregatesInput = {
    AND?: QuranTextScalarWhereWithAggregatesInput | QuranTextScalarWhereWithAggregatesInput[]
    OR?: QuranTextScalarWhereWithAggregatesInput[]
    NOT?: QuranTextScalarWhereWithAggregatesInput | QuranTextScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"QuranText"> | number
    sura?: IntWithAggregatesFilter<"QuranText"> | number
    aya?: IntWithAggregatesFilter<"QuranText"> | number
    text?: StringWithAggregatesFilter<"QuranText"> | string
  }

  export type UserBookmarkWhereInput = {
    AND?: UserBookmarkWhereInput | UserBookmarkWhereInput[]
    OR?: UserBookmarkWhereInput[]
    NOT?: UserBookmarkWhereInput | UserBookmarkWhereInput[]
    id?: StringFilter<"UserBookmark"> | string
    userId?: StringFilter<"UserBookmark"> | string
    surahId?: IntFilter<"UserBookmark"> | number
    verseNumber?: IntFilter<"UserBookmark"> | number
    verseText?: StringFilter<"UserBookmark"> | string
    surahName?: StringFilter<"UserBookmark"> | string
    translation?: StringFilter<"UserBookmark"> | string
    notes?: StringNullableFilter<"UserBookmark"> | string | null
    createdAt?: DateTimeFilter<"UserBookmark"> | Date | string
    updatedAt?: DateTimeFilter<"UserBookmark"> | Date | string
  }

  export type UserBookmarkOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    surahId?: SortOrder
    verseNumber?: SortOrder
    verseText?: SortOrder
    surahName?: SortOrder
    translation?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserBookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_surahId_verseNumber?: UserBookmarkUserIdSurahIdVerseNumberCompoundUniqueInput
    AND?: UserBookmarkWhereInput | UserBookmarkWhereInput[]
    OR?: UserBookmarkWhereInput[]
    NOT?: UserBookmarkWhereInput | UserBookmarkWhereInput[]
    userId?: StringFilter<"UserBookmark"> | string
    surahId?: IntFilter<"UserBookmark"> | number
    verseNumber?: IntFilter<"UserBookmark"> | number
    verseText?: StringFilter<"UserBookmark"> | string
    surahName?: StringFilter<"UserBookmark"> | string
    translation?: StringFilter<"UserBookmark"> | string
    notes?: StringNullableFilter<"UserBookmark"> | string | null
    createdAt?: DateTimeFilter<"UserBookmark"> | Date | string
    updatedAt?: DateTimeFilter<"UserBookmark"> | Date | string
  }, "id" | "userId_surahId_verseNumber">

  export type UserBookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    surahId?: SortOrder
    verseNumber?: SortOrder
    verseText?: SortOrder
    surahName?: SortOrder
    translation?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserBookmarkCountOrderByAggregateInput
    _avg?: UserBookmarkAvgOrderByAggregateInput
    _max?: UserBookmarkMaxOrderByAggregateInput
    _min?: UserBookmarkMinOrderByAggregateInput
    _sum?: UserBookmarkSumOrderByAggregateInput
  }

  export type UserBookmarkScalarWhereWithAggregatesInput = {
    AND?: UserBookmarkScalarWhereWithAggregatesInput | UserBookmarkScalarWhereWithAggregatesInput[]
    OR?: UserBookmarkScalarWhereWithAggregatesInput[]
    NOT?: UserBookmarkScalarWhereWithAggregatesInput | UserBookmarkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserBookmark"> | string
    userId?: StringWithAggregatesFilter<"UserBookmark"> | string
    surahId?: IntWithAggregatesFilter<"UserBookmark"> | number
    verseNumber?: IntWithAggregatesFilter<"UserBookmark"> | number
    verseText?: StringWithAggregatesFilter<"UserBookmark"> | string
    surahName?: StringWithAggregatesFilter<"UserBookmark"> | string
    translation?: StringWithAggregatesFilter<"UserBookmark"> | string
    notes?: StringNullableWithAggregatesFilter<"UserBookmark"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserBookmark"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserBookmark"> | Date | string
  }

  export type EnYusufaliCreateInput = {
    index: number
    sura: number
    aya: number
    text: string
  }

  export type EnYusufaliUncheckedCreateInput = {
    index: number
    sura: number
    aya: number
    text: string
  }

  export type EnYusufaliUpdateInput = {
    index?: IntFieldUpdateOperationsInput | number
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type EnYusufaliUncheckedUpdateInput = {
    index?: IntFieldUpdateOperationsInput | number
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type EnYusufaliCreateManyInput = {
    index: number
    sura: number
    aya: number
    text: string
  }

  export type EnYusufaliUpdateManyMutationInput = {
    index?: IntFieldUpdateOperationsInput | number
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type EnYusufaliUncheckedUpdateManyInput = {
    index?: IntFieldUpdateOperationsInput | number
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type QuranSajdaCreateInput = {
    surahNumber: number
    ayahNumber: number
    type?: string | null
  }

  export type QuranSajdaUncheckedCreateInput = {
    sajdaId?: number
    surahNumber: number
    ayahNumber: number
    type?: string | null
  }

  export type QuranSajdaUpdateInput = {
    surahNumber?: IntFieldUpdateOperationsInput | number
    ayahNumber?: IntFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuranSajdaUncheckedUpdateInput = {
    sajdaId?: IntFieldUpdateOperationsInput | number
    surahNumber?: IntFieldUpdateOperationsInput | number
    ayahNumber?: IntFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuranSajdaCreateManyInput = {
    sajdaId?: number
    surahNumber: number
    ayahNumber: number
    type?: string | null
  }

  export type QuranSajdaUpdateManyMutationInput = {
    surahNumber?: IntFieldUpdateOperationsInput | number
    ayahNumber?: IntFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuranSajdaUncheckedUpdateManyInput = {
    sajdaId?: IntFieldUpdateOperationsInput | number
    surahNumber?: IntFieldUpdateOperationsInput | number
    ayahNumber?: IntFieldUpdateOperationsInput | number
    type?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuranSurahCreateInput = {
    number: number
    arabicName: string
    transliteration: string
    englishName: string
    ayas: number
    revelationType: string
    chronologicalOrder: number
    rukus: number
    startIndex?: number | null
  }

  export type QuranSurahUncheckedCreateInput = {
    number: number
    arabicName: string
    transliteration: string
    englishName: string
    ayas: number
    revelationType: string
    chronologicalOrder: number
    rukus: number
    startIndex?: number | null
  }

  export type QuranSurahUpdateInput = {
    number?: IntFieldUpdateOperationsInput | number
    arabicName?: StringFieldUpdateOperationsInput | string
    transliteration?: StringFieldUpdateOperationsInput | string
    englishName?: StringFieldUpdateOperationsInput | string
    ayas?: IntFieldUpdateOperationsInput | number
    revelationType?: StringFieldUpdateOperationsInput | string
    chronologicalOrder?: IntFieldUpdateOperationsInput | number
    rukus?: IntFieldUpdateOperationsInput | number
    startIndex?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuranSurahUncheckedUpdateInput = {
    number?: IntFieldUpdateOperationsInput | number
    arabicName?: StringFieldUpdateOperationsInput | string
    transliteration?: StringFieldUpdateOperationsInput | string
    englishName?: StringFieldUpdateOperationsInput | string
    ayas?: IntFieldUpdateOperationsInput | number
    revelationType?: StringFieldUpdateOperationsInput | string
    chronologicalOrder?: IntFieldUpdateOperationsInput | number
    rukus?: IntFieldUpdateOperationsInput | number
    startIndex?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuranSurahCreateManyInput = {
    number: number
    arabicName: string
    transliteration: string
    englishName: string
    ayas: number
    revelationType: string
    chronologicalOrder: number
    rukus: number
    startIndex?: number | null
  }

  export type QuranSurahUpdateManyMutationInput = {
    number?: IntFieldUpdateOperationsInput | number
    arabicName?: StringFieldUpdateOperationsInput | string
    transliteration?: StringFieldUpdateOperationsInput | string
    englishName?: StringFieldUpdateOperationsInput | string
    ayas?: IntFieldUpdateOperationsInput | number
    revelationType?: StringFieldUpdateOperationsInput | string
    chronologicalOrder?: IntFieldUpdateOperationsInput | number
    rukus?: IntFieldUpdateOperationsInput | number
    startIndex?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuranSurahUncheckedUpdateManyInput = {
    number?: IntFieldUpdateOperationsInput | number
    arabicName?: StringFieldUpdateOperationsInput | string
    transliteration?: StringFieldUpdateOperationsInput | string
    englishName?: StringFieldUpdateOperationsInput | string
    ayas?: IntFieldUpdateOperationsInput | number
    revelationType?: StringFieldUpdateOperationsInput | string
    chronologicalOrder?: IntFieldUpdateOperationsInput | number
    rukus?: IntFieldUpdateOperationsInput | number
    startIndex?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuranTextCreateInput = {
    sura: number
    aya: number
    text: string
  }

  export type QuranTextUncheckedCreateInput = {
    id?: number
    sura: number
    aya: number
    text: string
  }

  export type QuranTextUpdateInput = {
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type QuranTextUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type QuranTextCreateManyInput = {
    id?: number
    sura: number
    aya: number
    text: string
  }

  export type QuranTextUpdateManyMutationInput = {
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type QuranTextUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    sura?: IntFieldUpdateOperationsInput | number
    aya?: IntFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
  }

  export type UserBookmarkCreateInput = {
    id?: string
    userId: string
    surahId: number
    verseNumber: number
    verseText: string
    surahName: string
    translation: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserBookmarkUncheckedCreateInput = {
    id?: string
    userId: string
    surahId: number
    verseNumber: number
    verseText: string
    surahName: string
    translation: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserBookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    surahId?: IntFieldUpdateOperationsInput | number
    verseNumber?: IntFieldUpdateOperationsInput | number
    verseText?: StringFieldUpdateOperationsInput | string
    surahName?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    surahId?: IntFieldUpdateOperationsInput | number
    verseNumber?: IntFieldUpdateOperationsInput | number
    verseText?: StringFieldUpdateOperationsInput | string
    surahName?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBookmarkCreateManyInput = {
    id?: string
    userId: string
    surahId: number
    verseNumber: number
    verseText: string
    surahName: string
    translation: string
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserBookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    surahId?: IntFieldUpdateOperationsInput | number
    verseNumber?: IntFieldUpdateOperationsInput | number
    verseText?: StringFieldUpdateOperationsInput | string
    surahName?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    surahId?: IntFieldUpdateOperationsInput | number
    verseNumber?: IntFieldUpdateOperationsInput | number
    verseText?: StringFieldUpdateOperationsInput | string
    surahName?: StringFieldUpdateOperationsInput | string
    translation?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnYusufaliCountOrderByAggregateInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type EnYusufaliAvgOrderByAggregateInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
  }

  export type EnYusufaliMaxOrderByAggregateInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type EnYusufaliMinOrderByAggregateInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type EnYusufaliSumOrderByAggregateInput = {
    index?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type QuranSajdaCountOrderByAggregateInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
    type?: SortOrder
  }

  export type QuranSajdaAvgOrderByAggregateInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
  }

  export type QuranSajdaMaxOrderByAggregateInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
    type?: SortOrder
  }

  export type QuranSajdaMinOrderByAggregateInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
    type?: SortOrder
  }

  export type QuranSajdaSumOrderByAggregateInput = {
    sajdaId?: SortOrder
    surahNumber?: SortOrder
    ayahNumber?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type QuranSurahCountOrderByAggregateInput = {
    number?: SortOrder
    arabicName?: SortOrder
    transliteration?: SortOrder
    englishName?: SortOrder
    ayas?: SortOrder
    revelationType?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrder
  }

  export type QuranSurahAvgOrderByAggregateInput = {
    number?: SortOrder
    ayas?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrder
  }

  export type QuranSurahMaxOrderByAggregateInput = {
    number?: SortOrder
    arabicName?: SortOrder
    transliteration?: SortOrder
    englishName?: SortOrder
    ayas?: SortOrder
    revelationType?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrder
  }

  export type QuranSurahMinOrderByAggregateInput = {
    number?: SortOrder
    arabicName?: SortOrder
    transliteration?: SortOrder
    englishName?: SortOrder
    ayas?: SortOrder
    revelationType?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrder
  }

  export type QuranSurahSumOrderByAggregateInput = {
    number?: SortOrder
    ayas?: SortOrder
    chronologicalOrder?: SortOrder
    rukus?: SortOrder
    startIndex?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type QuranTextCountOrderByAggregateInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type QuranTextAvgOrderByAggregateInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
  }

  export type QuranTextMaxOrderByAggregateInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type QuranTextMinOrderByAggregateInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
    text?: SortOrder
  }

  export type QuranTextSumOrderByAggregateInput = {
    id?: SortOrder
    sura?: SortOrder
    aya?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserBookmarkUserIdSurahIdVerseNumberCompoundUniqueInput = {
    userId: string
    surahId: number
    verseNumber: number
  }

  export type UserBookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    surahId?: SortOrder
    verseNumber?: SortOrder
    verseText?: SortOrder
    surahName?: SortOrder
    translation?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserBookmarkAvgOrderByAggregateInput = {
    surahId?: SortOrder
    verseNumber?: SortOrder
  }

  export type UserBookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    surahId?: SortOrder
    verseNumber?: SortOrder
    verseText?: SortOrder
    surahName?: SortOrder
    translation?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserBookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    surahId?: SortOrder
    verseNumber?: SortOrder
    verseText?: SortOrder
    surahName?: SortOrder
    translation?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserBookmarkSumOrderByAggregateInput = {
    surahId?: SortOrder
    verseNumber?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use EnYusufaliDefaultArgs instead
     */
    export type EnYusufaliArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EnYusufaliDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuranSajdaDefaultArgs instead
     */
    export type QuranSajdaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuranSajdaDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuranSurahDefaultArgs instead
     */
    export type QuranSurahArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuranSurahDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QuranTextDefaultArgs instead
     */
    export type QuranTextArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QuranTextDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserBookmarkDefaultArgs instead
     */
    export type UserBookmarkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserBookmarkDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}