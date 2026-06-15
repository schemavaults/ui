/**
 * Semantic categories for column data types. Each category maps to a
 * distinct colour palette in {@link dataTypeColors}. Unknown / unrecognised
 * types fall through to `"other"`.
 */
export const dataTypeCategoryIds = [
  "numeric",
  "text",
  "boolean",
  "datetime",
  "binary",
  "json",
  "uuid",
  "array",
  "enum",
  "geo",
  "xml",
  "money",
  "other",
] as const satisfies readonly string[];
export type DataTypeCategory = (typeof dataTypeCategoryIds)[number];

export const dataTypeBadgeAppearanceIds = [
  "solid",
  "soft",
  "outline",
] as const satisfies readonly string[];
export type DataTypeBadgeAppearance =
  (typeof dataTypeBadgeAppearanceIds)[number];

export const dataTypeBadgeSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type DataTypeBadgeSize = (typeof dataTypeBadgeSizeIds)[number];

/**
 * Recognised data type identifiers — the union of common SQL dialects
 * (Postgres, MySQL, SQLite, MSSQL, BigQuery, Snowflake) — mapped onto a
 * semantic category. Lookups are performed against the uppercased,
 * parameter-stripped form (e.g. `VARCHAR(255)` → `VARCHAR`).
 */
export const knownDataTypes: Record<string, DataTypeCategory> = {
  // Numeric
  INT: "numeric",
  INT2: "numeric",
  INT4: "numeric",
  INT8: "numeric",
  INTEGER: "numeric",
  BIGINT: "numeric",
  SMALLINT: "numeric",
  TINYINT: "numeric",
  MEDIUMINT: "numeric",
  DECIMAL: "numeric",
  NUMERIC: "numeric",
  FLOAT: "numeric",
  FLOAT4: "numeric",
  FLOAT8: "numeric",
  DOUBLE: "numeric",
  "DOUBLE PRECISION": "numeric",
  REAL: "numeric",
  SERIAL: "numeric",
  BIGSERIAL: "numeric",
  SMALLSERIAL: "numeric",
  NUMBER: "numeric",
  // Text
  CHAR: "text",
  CHARACTER: "text",
  "CHARACTER VARYING": "text",
  VARCHAR: "text",
  VARCHAR2: "text",
  NCHAR: "text",
  NVARCHAR: "text",
  NVARCHAR2: "text",
  TEXT: "text",
  TINYTEXT: "text",
  MEDIUMTEXT: "text",
  LONGTEXT: "text",
  STRING: "text",
  CLOB: "text",
  NCLOB: "text",
  // Boolean
  BOOL: "boolean",
  BOOLEAN: "boolean",
  BIT: "boolean",
  // Date/Time
  DATE: "datetime",
  TIME: "datetime",
  TIMETZ: "datetime",
  "TIME WITH TIME ZONE": "datetime",
  TIMESTAMP: "datetime",
  TIMESTAMPTZ: "datetime",
  "TIMESTAMP WITH TIME ZONE": "datetime",
  "TIMESTAMP WITHOUT TIME ZONE": "datetime",
  DATETIME: "datetime",
  DATETIME2: "datetime",
  SMALLDATETIME: "datetime",
  YEAR: "datetime",
  INTERVAL: "datetime",
  // Binary
  BLOB: "binary",
  TINYBLOB: "binary",
  MEDIUMBLOB: "binary",
  LONGBLOB: "binary",
  BYTEA: "binary",
  BINARY: "binary",
  VARBINARY: "binary",
  IMAGE: "binary",
  // JSON
  JSON: "json",
  JSONB: "json",
  // UUID
  UUID: "uuid",
  UUIDV4: "uuid",
  UNIQUEIDENTIFIER: "uuid",
  GUID: "uuid",
  // Array (catch-all for SQL array types and ARRAY)
  ARRAY: "array",
  // Enum
  ENUM: "enum",
  SET: "enum",
  // Geo
  GEOMETRY: "geo",
  GEOGRAPHY: "geo",
  POINT: "geo",
  LINESTRING: "geo",
  POLYGON: "geo",
  MULTIPOINT: "geo",
  MULTILINESTRING: "geo",
  MULTIPOLYGON: "geo",
  // XML
  XML: "xml",
  // Money
  MONEY: "money",
  SMALLMONEY: "money",
  CURRENCY: "money",
};
