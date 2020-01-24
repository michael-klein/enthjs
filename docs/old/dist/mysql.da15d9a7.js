// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.js":[function(require,module,exports) {
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.language = exports.conf = void 0;
var conf = {
  comments: {
    lineComment: '--',
    blockComment: ['/*', '*/']
  },
  brackets: [['{', '}'], ['[', ']'], ['(', ')']],
  autoClosingPairs: [{
    open: '{',
    close: '}'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '"',
    close: '"'
  }, {
    open: '\'',
    close: '\''
  }],
  surroundingPairs: [{
    open: '{',
    close: '}'
  }, {
    open: '[',
    close: ']'
  }, {
    open: '(',
    close: ')'
  }, {
    open: '"',
    close: '"'
  }, {
    open: '\'',
    close: '\''
  }]
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.sql',
  ignoreCase: true,
  brackets: [{
    open: '[',
    close: ']',
    token: 'delimiter.square'
  }, {
    open: '(',
    close: ')',
    token: 'delimiter.parenthesis'
  }],
  keywords: ["ACCESSIBLE", "ACCOUNT", "ACTION", "ADD", "AFTER", "AGAINST", "AGGREGATE", "ALGORITHM", "ALL", "ALTER", "ALWAYS", "ANALYSE", "ANALYZE", "AND", "ANY", "AS", "ASC", "ASCII", "ASENSITIVE", "AT", "AUTOEXTEND_SIZE", "AUTO_INCREMENT", "AVG", "AVG_ROW_LENGTH", "BACKUP", "BEFORE", "BEGIN", "BETWEEN", "BIGINT", "BINARY", "BINLOG", "BIT", "BLOB", "BLOCK", "BOOL", "BOOLEAN", "BOTH", "BTREE", "BY", "BYTE", "CACHE", "CALL", "CASCADE", "CASCADED", "CASE", "CATALOG_NAME", "CHAIN", "CHANGE", "CHANGED", "CHANNEL", "CHAR", "CHARACTER", "CHARSET", "CHECK", "CHECKSUM", "CIPHER", "CLASS_ORIGIN", "CLIENT", "CLOSE", "COALESCE", "CODE", "COLLATE", "COLLATION", "COLUMN", "COLUMNS", "COLUMN_FORMAT", "COLUMN_NAME", "COMMENT", "COMMIT", "COMMITTED", "COMPACT", "COMPLETION", "COMPRESSED", "COMPRESSION", "CONCURRENT", "CONDITION", "CONNECTION", "CONSISTENT", "CONSTRAINT", "CONSTRAINT_CATALOG", "CONSTRAINT_NAME", "CONSTRAINT_SCHEMA", "CONTAINS", "CONTEXT", "CONTINUE", "CONVERT", "CPU", "CREATE", "CROSS", "CUBE", "CURRENT", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "CURSOR", "CURSOR_NAME", "DATA", "DATABASE", "DATABASES", "DATAFILE", "DATE", "DATETIME", "DAY", "DAY_HOUR", "DAY_MICROSECOND", "DAY_MINUTE", "DAY_SECOND", "DEALLOCATE", "DEC", "DECIMAL", "DECLARE", "DEFAULT", "DEFAULT_AUTH", "DEFINER", "DELAYED", "DELAY_KEY_WRITE", "DELETE", "DESC", "DESCRIBE", "DES_KEY_FILE", "DETERMINISTIC", "DIAGNOSTICS", "DIRECTORY", "DISABLE", "DISCARD", "DISK", "DISTINCT", "DISTINCTROW", "DIV", "DO", "DOUBLE", "DROP", "DUAL", "DUMPFILE", "DUPLICATE", "DYNAMIC", "EACH", "ELSE", "ELSEIF", "ENABLE", "ENCLOSED", "ENCRYPTION", "END", "ENDS", "ENGINE", "ENGINES", "ENUM", "ERROR", "ERRORS", "ESCAPE", "ESCAPED", "EVENT", "EVENTS", "EVERY", "EXCHANGE", "EXECUTE", "EXISTS", "EXIT", "EXPANSION", "EXPIRE", "EXPLAIN", "EXPORT", "EXTENDED", "EXTENT_SIZE", "FALSE", "FAST", "FAULTS", "FETCH", "FIELDS", "FILE", "FILE_BLOCK_SIZE", "FILTER", "FIRST", "FIXED", "FLOAT", "FLOAT4", "FLOAT8", "FLUSH", "FOLLOWS", "FOR", "FORCE", "FOREIGN", "FORMAT", "FOUND", "FROM", "FULL", "FULLTEXT", "FUNCTION", "GENERAL", "GENERATED", "GEOMETRY", "GEOMETRYCOLLECTION", "GET", "GET_FORMAT", "GLOBAL", "GRANT", "GRANTS", "GROUP", "GROUP_REPLICATION", "HANDLER", "HASH", "HAVING", "HELP", "HIGH_PRIORITY", "HOST", "HOSTS", "HOUR", "HOUR_MICROSECOND", "HOUR_MINUTE", "HOUR_SECOND", "IDENTIFIED", "IF", "IGNORE", "IGNORE_SERVER_IDS", "IMPORT", "INDEX", "INDEXES", "INFILE", "INITIAL_SIZE", "INNER", "INOUT", "INSENSITIVE", "INSERT", "INSERT_METHOD", "INSTALL", "INSTANCE", "INT", "INT1", "INT2", "INT3", "INT4", "INT8", "INTEGER", "INTERVAL", "INTO", "INVOKER", "IO", "IO_AFTER_GTIDS", "IO_BEFORE_GTIDS", "IO_THREAD", "IPC", "ISOLATION", "ISSUER", "ITERATE", "JOIN", "JSON", "KEY", "KEYS", "KEY_BLOCK_SIZE", "KILL", "LANGUAGE", "LAST", "LEADING", "LEAVE", "LEAVES", "LEFT", "LESS", "LEVEL", "LIKE", "LIMIT", "LINEAR", "LINES", "LINESTRING", "LIST", "LOAD", "LOCAL", "LOCALTIME", "LOCALTIMESTAMP", "LOCK", "LOCKS", "LOGFILE", "LOGS", "LONG", "LONGBLOB", "LONGTEXT", "LOOP", "LOW_PRIORITY", "MASTER", "MASTER_AUTO_POSITION", "MASTER_BIND", "MASTER_CONNECT_RETRY", "MASTER_DELAY", "MASTER_HEARTBEAT_PERIOD", "MASTER_HOST", "MASTER_LOG_FILE", "MASTER_LOG_POS", "MASTER_PASSWORD", "MASTER_PORT", "MASTER_RETRY_COUNT", "MASTER_SERVER_ID", "MASTER_SSL", "MASTER_SSL_CA", "MASTER_SSL_CAPATH", "MASTER_SSL_CERT", "MASTER_SSL_CIPHER", "MASTER_SSL_CRL", "MASTER_SSL_CRLPATH", "MASTER_SSL_KEY", "MASTER_SSL_VERIFY_SERVER_CERT", "MASTER_TLS_VERSION", "MASTER_USER", "MATCH", "MAXVALUE", "MAX_CONNECTIONS_PER_HOUR", "MAX_QUERIES_PER_HOUR", "MAX_ROWS", "MAX_SIZE", "MAX_STATEMENT_TIME", "MAX_UPDATES_PER_HOUR", "MAX_USER_CONNECTIONS", "MEDIUM", "MEDIUMBLOB", "MEDIUMINT", "MEDIUMTEXT", "MEMORY", "MERGE", "MESSAGE_TEXT", "MICROSECOND", "MIDDLEINT", "MIGRATE", "MINUTE", "MINUTE_MICROSECOND", "MINUTE_SECOND", "MIN_ROWS", "MOD", "MODE", "MODIFIES", "MODIFY", "MONTH", "MULTILINESTRING", "MULTIPOINT", "MULTIPOLYGON", "MUTEX", "MYSQL_ERRNO", "NAME", "NAMES", "NATIONAL", "NATURAL", "NCHAR", "NDB", "NDBCLUSTER", "NEVER", "NEW", "NEXT", "NO", "NODEGROUP", "NONBLOCKING", "NONE", "NO_WAIT", "NO_WRITE_TO_BINLOG", "NUMBER", "NUMERIC", "NVARCHAR", "OFFSET", "OLD_PASSWORD", "ON", "ONE", "ONLY", "OPEN", "OPTIMIZE", "OPTIMIZER_COSTS", "OPTION", "OPTIONALLY", "OPTIONS", "OR", "ORDER", "OUT", "OUTER", "OUTFILE", "OWNER", "PACK_KEYS", "PAGE", "PARSER", "PARSE_GCOL_EXPR", "PARTIAL", "PARTITION", "PARTITIONING", "PARTITIONS", "PASSWORD", "PHASE", "PLUGIN", "PLUGINS", "PLUGIN_DIR", "POINT", "POLYGON", "PORT", "PRECEDES", "PRECISION", "PREPARE", "PRESERVE", "PREV", "PRIMARY", "PRIVILEGES", "PROCEDURE", "PROCESSLIST", "PROFILE", "PROFILES", "PROXY", "PURGE", "QUARTER", "QUERY", "QUICK", "RANGE", "READ", "READS", "READ_ONLY", "READ_WRITE", "REAL", "REBUILD", "RECOVER", "REDOFILE", "REDO_BUFFER_SIZE", "REDUNDANT", "REFERENCES", "REGEXP", "RELAY", "RELAYLOG", "RELAY_LOG_FILE", "RELAY_LOG_POS", "RELAY_THREAD", "RELEASE", "RELOAD", "REMOVE", "RENAME", "REORGANIZE", "REPAIR", "REPEAT", "REPEATABLE", "REPLACE", "REPLICATE_DO_DB", "REPLICATE_DO_TABLE", "REPLICATE_IGNORE_DB", "REPLICATE_IGNORE_TABLE", "REPLICATE_REWRITE_DB", "REPLICATE_WILD_DO_TABLE", "REPLICATE_WILD_IGNORE_TABLE", "REPLICATION", "REQUIRE", "RESET", "RESIGNAL", "RESTORE", "RESTRICT", "RESUME", "RETURN", "RETURNED_SQLSTATE", "RETURNS", "REVERSE", "REVOKE", "RIGHT", "RLIKE", "ROLLBACK", "ROLLUP", "ROTATE", "ROUTINE", "ROW", "ROWS", "ROW_COUNT", "ROW_FORMAT", "RTREE", "SAVEPOINT", "SCHEDULE", "SCHEMA", "SCHEMAS", "SCHEMA_NAME", "SECOND", "SECOND_MICROSECOND", "SECURITY", "SELECT", "SENSITIVE", "SEPARATOR", "SERIAL", "SERIALIZABLE", "SERVER", "SESSION", "SET", "SHARE", "SHOW", "SHUTDOWN", "SIGNAL", "SIGNED", "SIMPLE", "SLAVE", "SLOW", "SMALLINT", "SNAPSHOT", "SOCKET", "SOME", "SONAME", "SOUNDS", "SOURCE", "SPATIAL", "SPECIFIC", "SQL", "SQLEXCEPTION", "SQLSTATE", "SQLWARNING", "SQL_AFTER_GTIDS", "SQL_AFTER_MTS_GAPS", "SQL_BEFORE_GTIDS", "SQL_BIG_RESULT", "SQL_BUFFER_RESULT", "SQL_CACHE", "SQL_CALC_FOUND_ROWS", "SQL_NO_CACHE", "SQL_SMALL_RESULT", "SQL_THREAD", "SQL_TSI_DAY", "SQL_TSI_HOUR", "SQL_TSI_MINUTE", "SQL_TSI_MONTH", "SQL_TSI_QUARTER", "SQL_TSI_SECOND", "SQL_TSI_WEEK", "SQL_TSI_YEAR", "SSL", "STACKED", "START", "STARTING", "STARTS", "STATS_AUTO_RECALC", "STATS_PERSISTENT", "STATS_SAMPLE_PAGES", "STATUS", "STOP", "STORAGE", "STORED", "STRAIGHT_JOIN", "STRING", "SUBCLASS_ORIGIN", "SUBJECT", "SUBPARTITION", "SUBPARTITIONS", "SUPER", "SUSPEND", "SWAPS", "SWITCHES", "TABLE", "TABLES", "TABLESPACE", "TABLE_CHECKSUM", "TABLE_NAME", "TEMPORARY", "TEMPTABLE", "TERMINATED", "TEXT", "THAN", "THEN", "TIME", "TIMESTAMP", "TIMESTAMPADD", "TIMESTAMPDIFF", "TINYBLOB", "TINYINT", "TINYTEXT", "TO", "TRAILING", "TRANSACTION", "TRIGGER", "TRIGGERS", "TRUE", "TRUNCATE", "TYPE", "TYPES", "UNCOMMITTED", "UNDEFINED", "UNDO", "UNDOFILE", "UNDO_BUFFER_SIZE", "UNICODE", "UNINSTALL", "UNION", "UNIQUE", "UNKNOWN", "UNLOCK", "UNSIGNED", "UNTIL", "UPDATE", "UPGRADE", "USAGE", "USE", "USER", "USER_RESOURCES", "USE_FRM", "USING", "UTC_DATE", "UTC_TIME", "UTC_TIMESTAMP", "VALIDATION", "VALUE", "VALUES", "VARBINARY", "VARCHAR", "VARCHARACTER", "VARIABLES", "VARYING", "VIEW", "VIRTUAL", "WAIT", "WARNINGS", "WEEK", "WEIGHT_STRING", "WHEN", "WHERE", "WHILE", "WITH", "WITHOUT", "WORK", "WRAPPER", "WRITE", "X509", "XA", "XID", "XML", "XOR", "YEAR", "YEAR_MONTH", "ZEROFILL"],
  operators: ["AND", "BETWEEN", "IN", "LIKE", "NOT", "OR", "IS", "NULL", "INTERSECT", "UNION", "INNER", "JOIN", "LEFT", "OUTER", "RIGHT"],
  builtinFunctions: ["ABS", "ACOS", "ADDDATE", "ADDTIME", "AES_DECRYPT", "AES_ENCRYPT", "ANY_VALUE", "Area", "AsBinary", "AsWKB", "ASCII", "ASIN", "AsText", "AsWKT", "ASYMMETRIC_DECRYPT", "ASYMMETRIC_DERIVE", "ASYMMETRIC_ENCRYPT", "ASYMMETRIC_SIGN", "ASYMMETRIC_VERIFY", "ATAN", "ATAN2", "ATAN", "AVG", "BENCHMARK", "BIN", "BIT_AND", "BIT_COUNT", "BIT_LENGTH", "BIT_OR", "BIT_XOR", "Buffer", "CAST", "CEIL", "CEILING", "Centroid", "CHAR", "CHAR_LENGTH", "CHARACTER_LENGTH", "CHARSET", "COALESCE", "COERCIBILITY", "COLLATION", "COMPRESS", "CONCAT", "CONCAT_WS", "CONNECTION_ID", "Contains", "CONV", "CONVERT", "CONVERT_TZ", "ConvexHull", "COS", "COT", "COUNT", "CRC32", "CREATE_ASYMMETRIC_PRIV_KEY", "CREATE_ASYMMETRIC_PUB_KEY", "CREATE_DH_PARAMETERS", "CREATE_DIGEST", "Crosses", "CURDATE", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "CURRENT_USER", "CURTIME", "DATABASE", "DATE", "DATE_ADD", "DATE_FORMAT", "DATE_SUB", "DATEDIFF", "DAY", "DAYNAME", "DAYOFMONTH", "DAYOFWEEK", "DAYOFYEAR", "DECODE", "DEFAULT", "DEGREES", "DES_DECRYPT", "DES_ENCRYPT", "Dimension", "Disjoint", "Distance", "ELT", "ENCODE", "ENCRYPT", "EndPoint", "Envelope", "Equals", "EXP", "EXPORT_SET", "ExteriorRing", "EXTRACT", "ExtractValue", "FIELD", "FIND_IN_SET", "FLOOR", "FORMAT", "FOUND_ROWS", "FROM_BASE64", "FROM_DAYS", "FROM_UNIXTIME", "GeomCollFromText", "GeometryCollectionFromText", "GeomCollFromWKB", "GeometryCollectionFromWKB", "GeometryCollection", "GeometryN", "GeometryType", "GeomFromText", "GeometryFromText", "GeomFromWKB", "GeometryFromWKB", "GET_FORMAT", "GET_LOCK", "GLength", "GREATEST", "GROUP_CONCAT", "GTID_SUBSET", "GTID_SUBTRACT", "HEX", "HOUR", "IF", "IFNULL", "INET_ATON", "INET_NTOA", "INET6_ATON", "INET6_NTOA", "INSERT", "INSTR", "InteriorRingN", "Intersects", "INTERVAL", "IS_FREE_LOCK", "IS_IPV4", "IS_IPV4_COMPAT", "IS_IPV4_MAPPED", "IS_IPV6", "IS_USED_LOCK", "IsClosed", "IsEmpty", "ISNULL", "IsSimple", "JSON_APPEND", "JSON_ARRAY", "JSON_ARRAY_APPEND", "JSON_ARRAY_INSERT", "JSON_CONTAINS", "JSON_CONTAINS_PATH", "JSON_DEPTH", "JSON_EXTRACT", "JSON_INSERT", "JSON_KEYS", "JSON_LENGTH", "JSON_MERGE", "JSON_MERGE_PRESERVE", "JSON_OBJECT", "JSON_QUOTE", "JSON_REMOVE", "JSON_REPLACE", "JSON_SEARCH", "JSON_SET", "JSON_TYPE", "JSON_UNQUOTE", "JSON_VALID", "LAST_INSERT_ID", "LCASE", "LEAST", "LEFT", "LENGTH", "LineFromText", "LineStringFromText", "LineFromWKB", "LineStringFromWKB", "LineString", "LN", "LOAD_FILE", "LOCALTIME", "LOCALTIMESTAMP", "LOCATE", "LOG", "LOG10", "LOG2", "LOWER", "LPAD", "LTRIM", "MAKE_SET", "MAKEDATE", "MAKETIME", "MASTER_POS_WAIT", "MAX", "MBRContains", "MBRCoveredBy", "MBRCovers", "MBRDisjoint", "MBREqual", "MBREquals", "MBRIntersects", "MBROverlaps", "MBRTouches", "MBRWithin", "MD5", "MICROSECOND", "MID", "MIN", "MINUTE", "MLineFromText", "MultiLineStringFromText", "MLineFromWKB", "MultiLineStringFromWKB", "MOD", "MONTH", "MONTHNAME", "MPointFromText", "MultiPointFromText", "MPointFromWKB", "MultiPointFromWKB", "MPolyFromText", "MultiPolygonFromText", "MPolyFromWKB", "MultiPolygonFromWKB", "MultiLineString", "MultiPoint", "MultiPolygon", "NAME_CONST", "NOT IN", "NOW", "NULLIF", "NumGeometries", "NumInteriorRings", "NumPoints", "OCT", "OCTET_LENGTH", "OLD_PASSWORD", "ORD", "Overlaps", "PASSWORD", "PERIOD_ADD", "PERIOD_DIFF", "PI", "Point", "PointFromText", "PointFromWKB", "PointN", "PolyFromText", "PolygonFromText", "PolyFromWKB", "PolygonFromWKB", "Polygon", "POSITION", "POW", "POWER", "PROCEDURE ANALYSE", "QUARTER", "QUOTE", "RADIANS", "RAND", "RANDOM_BYTES", "RELEASE_ALL_LOCKS", "RELEASE_LOCK", "REPEAT", "REPLACE", "REVERSE", "RIGHT", "ROUND", "ROW_COUNT", "RPAD", "RTRIM", "SCHEMA", "SEC_TO_TIME", "SECOND", "SESSION_USER", "SHA1", "SHA", "SHA2", "SIGN", "SIN", "SLEEP", "SOUNDEX", "SPACE", "SQRT", "SRID", "ST_Area", "ST_AsBinary", "ST_AsWKB", "ST_AsGeoJSON", "ST_AsText", "ST_AsWKT", "ST_Buffer", "ST_Buffer_Strategy", "ST_Centroid", "ST_Contains", "ST_ConvexHull", "ST_Crosses", "ST_Difference", "ST_Dimension", "ST_Disjoint", "ST_Distance", "ST_Distance_Sphere", "ST_EndPoint", "ST_Envelope", "ST_Equals", "ST_ExteriorRing", "ST_GeoHash", "ST_GeomCollFromText", "ST_GeometryCollectionFromText", "ST_GeomCollFromTxt", "ST_GeomCollFromWKB", "ST_GeometryCollectionFromWKB", "ST_GeometryN", "ST_GeometryType", "ST_GeomFromGeoJSON", "ST_GeomFromText", "ST_GeometryFromText", "ST_GeomFromWKB", "ST_GeometryFromWKB", "ST_InteriorRingN", "ST_Intersection", "ST_Intersects", "ST_IsClosed", "ST_IsEmpty", "ST_IsSimple", "ST_IsValid", "ST_LatFromGeoHash", "ST_Length", "ST_LineFromText", "ST_LineStringFromText", "ST_LineFromWKB", "ST_LineStringFromWKB", "ST_LongFromGeoHash", "ST_MakeEnvelope", "ST_MLineFromText", "ST_MultiLineStringFromText", "ST_MLineFromWKB", "ST_MultiLineStringFromWKB", "ST_MPointFromText", "ST_MultiPointFromText", "ST_MPointFromWKB", "ST_MultiPointFromWKB", "ST_MPolyFromText", "ST_MultiPolygonFromText", "ST_MPolyFromWKB", "ST_MultiPolygonFromWKB", "ST_NumGeometries", "ST_NumInteriorRing", "ST_NumInteriorRings", "ST_NumPoints", "ST_Overlaps", "ST_PointFromGeoHash", "ST_PointFromText", "ST_PointFromWKB", "ST_PointN", "ST_PolyFromText", "ST_PolygonFromText", "ST_PolyFromWKB", "ST_PolygonFromWKB", "ST_Simplify", "ST_SRID", "ST_StartPoint", "ST_SymDifference", "ST_Touches", "ST_Union", "ST_Validate", "ST_Within", "ST_X", "ST_Y", "StartPoint", "STD", "STDDEV", "STDDEV_POP", "STDDEV_SAMP", "STR_TO_DATE", "STRCMP", "SUBDATE", "SUBSTR", "SUBSTRING", "SUBSTRING_INDEX", "SUBTIME", "SUM", "SYSDATE", "SYSTEM_USER", "TAN", "TIME", "TIME_FORMAT", "TIME_TO_SEC", "TIMEDIFF", "TIMESTAMP", "TIMESTAMPADD", "TIMESTAMPDIFF", "TO_BASE64", "TO_DAYS", "TO_SECONDS", "Touches", "TRIM", "TRUNCATE", "UCASE", "UNCOMPRESS", "UNCOMPRESSED_LENGTH", "UNHEX", "UNIX_TIMESTAMP", "UpdateXML", "UPPER", "USER", "UTC_DATE", "UTC_TIME", "UTC_TIMESTAMP", "UUID", "UUID_SHORT", "VALIDATE_PASSWORD_STRENGTH", "VALUES", "VAR_POP", "VAR_SAMP", "VARIANCE", "VERSION", "WAIT_FOR_EXECUTED_GTID_SET", "WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS", "WEEK", "WEEKDAY", "WEEKOFYEAR", "WEIGHT_STRING", "Within", "X", "Y", "YEAR", "YEARWEEK"],
  builtinVariables: [// NOT SUPPORTED
  ],
  tokenizer: {
    root: [{
      include: '@comments'
    }, {
      include: '@whitespace'
    }, {
      include: '@numbers'
    }, {
      include: '@strings'
    }, {
      include: '@complexIdentifiers'
    }, {
      include: '@scopes'
    }, [/[;,.]/, 'delimiter'], [/[()]/, '@brackets'], [/[\w@]+/, {
      cases: {
        '@keywords': 'keyword',
        '@operators': 'operator',
        '@builtinVariables': 'predefined',
        '@builtinFunctions': 'predefined',
        '@default': 'identifier'
      }
    }], [/[<>=!%&+\-*/|~^]/, 'operator']],
    whitespace: [[/\s+/, 'white']],
    comments: [[/--+.*/, 'comment'], [/#+.*/, 'comment'], [/\/\*/, {
      token: 'comment.quote',
      next: '@comment'
    }]],
    comment: [[/[^*/]+/, 'comment'], // Not supporting nested comments, as nested comments seem to not be standard?
    // i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
    // [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
    [/\*\//, {
      token: 'comment.quote',
      next: '@pop'
    }], [/./, 'comment']],
    numbers: [[/0[xX][0-9a-fA-F]*/, 'number'], [/[$][+-]*\d*(\.\d*)?/, 'number'], [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number']],
    strings: [[/'/, {
      token: 'string',
      next: '@string'
    }], [/"/, {
      token: 'string.double',
      next: '@stringDouble'
    }]],
    string: [[/[^']+/, 'string'], [/''/, 'string'], [/'/, {
      token: 'string',
      next: '@pop'
    }]],
    stringDouble: [[/[^"]+/, 'string.double'], [/""/, 'string.double'], [/"/, {
      token: 'string.double',
      next: '@pop'
    }]],
    complexIdentifiers: [[/`/, {
      token: 'identifier.quote',
      next: '@quotedIdentifier'
    }]],
    quotedIdentifier: [[/[^`]+/, 'identifier'], [/``/, 'identifier'], [/`/, {
      token: 'identifier.quote',
      next: '@pop'
    }]],
    scopes: [// NOT SUPPORTED
    ]
  }
};
exports.language = language;
},{}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38799" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/mysql/mysql.js"], null)
//# sourceMappingURL=/mysql.da15d9a7.js.map