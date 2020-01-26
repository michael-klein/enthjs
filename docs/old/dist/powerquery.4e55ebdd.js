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
})({"node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery.js":[function(require,module,exports) {
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
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [['[', ']'], ['(', ')'], ['{', '}']],
  autoClosingPairs: [{
    open: '"',
    close: '"',
    notIn: ['string', 'comment', 'identifier']
  }, {
    open: '[',
    close: ']',
    notIn: ['string', 'comment', 'identifier']
  }, {
    open: '(',
    close: ')',
    notIn: ['string', 'comment', 'identifier']
  }, {
    open: '{',
    close: '}',
    notIn: ['string', 'comment', 'identifier']
  }]
};
exports.conf = conf;
var language = {
  defaultToken: '',
  tokenPostfix: '.pq',
  ignoreCase: false,
  brackets: [{
    open: '[',
    close: ']',
    token: 'delimiter.square'
  }, {
    open: '{',
    close: '}',
    token: 'delimiter.brackets'
  }, {
    open: '(',
    close: ')',
    token: 'delimiter.parenthesis'
  }],
  operatorKeywords: ["and", "not", "or"],
  keywords: ["as", "each", "else", "error", "false", "if", "in", "is", "let", "meta", "otherwise", "section", "shared", "then", "true", "try", "type"],
  constructors: ["#binary", "#date", "#datetime", "#datetimezone", "#duration", "#table", "#time"],
  constants: ["#infinity", "#nan", "#sections", "#shared"],
  typeKeywords: ["action", "any", "anynonnull", "none", "null", "logical", "number", "time", "date", "datetime", "datetimezone", "duration", "text", "binary", "list", "record", "table", "function"],
  builtinFunctions: ["Access.Database", "Action.Return", "Action.Sequence", "Action.Try", "ActiveDirectory.Domains", "AdoDotNet.DataSource", "AdoDotNet.Query", "AdobeAnalytics.Cubes", "AnalysisServices.Database", "AnalysisServices.Databases", "AzureStorage.BlobContents", "AzureStorage.Blobs", "AzureStorage.Tables", "Binary.Buffer", "Binary.Combine", "Binary.Compress", "Binary.Decompress", "Binary.End", "Binary.From", "Binary.FromList", "Binary.FromText", "Binary.InferContentType", "Binary.Length", "Binary.ToList", "Binary.ToText", "BinaryFormat.7BitEncodedSignedInteger", "BinaryFormat.7BitEncodedUnsignedInteger", "BinaryFormat.Binary", "BinaryFormat.Byte", "BinaryFormat.ByteOrder", "BinaryFormat.Choice", "BinaryFormat.Decimal", "BinaryFormat.Double", "BinaryFormat.Group", "BinaryFormat.Length", "BinaryFormat.List", "BinaryFormat.Null", "BinaryFormat.Record", "BinaryFormat.SignedInteger16", "BinaryFormat.SignedInteger32", "BinaryFormat.SignedInteger64", "BinaryFormat.Single", "BinaryFormat.Text", "BinaryFormat.Transform", "BinaryFormat.UnsignedInteger16", "BinaryFormat.UnsignedInteger32", "BinaryFormat.UnsignedInteger64", "Byte.From", "Character.FromNumber", "Character.ToNumber", "Combiner.CombineTextByDelimiter", "Combiner.CombineTextByEachDelimiter", "Combiner.CombineTextByLengths", "Combiner.CombineTextByPositions", "Combiner.CombineTextByRanges", "Comparer.Equals", "Comparer.FromCulture", "Comparer.Ordinal", "Comparer.OrdinalIgnoreCase", "Csv.Document", "Cube.AddAndExpandDimensionColumn", "Cube.AddMeasureColumn", "Cube.ApplyParameter", "Cube.AttributeMemberId", "Cube.AttributeMemberProperty", "Cube.CollapseAndRemoveColumns", "Cube.Dimensions", "Cube.DisplayFolders", "Cube.Measures", "Cube.Parameters", "Cube.Properties", "Cube.PropertyKey", "Cube.ReplaceDimensions", "Cube.Transform", "Currency.From", "DB2.Database", "Date.AddDays", "Date.AddMonths", "Date.AddQuarters", "Date.AddWeeks", "Date.AddYears", "Date.Day", "Date.DayOfWeek", "Date.DayOfWeekName", "Date.DayOfYear", "Date.DaysInMonth", "Date.EndOfDay", "Date.EndOfMonth", "Date.EndOfQuarter", "Date.EndOfWeek", "Date.EndOfYear", "Date.From", "Date.FromText", "Date.IsInCurrentDay", "Date.IsInCurrentMonth", "Date.IsInCurrentQuarter", "Date.IsInCurrentWeek", "Date.IsInCurrentYear", "Date.IsInNextDay", "Date.IsInNextMonth", "Date.IsInNextNDays", "Date.IsInNextNMonths", "Date.IsInNextNQuarters", "Date.IsInNextNWeeks", "Date.IsInNextNYears", "Date.IsInNextQuarter", "Date.IsInNextWeek", "Date.IsInNextYear", "Date.IsInPreviousDay", "Date.IsInPreviousMonth", "Date.IsInPreviousNDays", "Date.IsInPreviousNMonths", "Date.IsInPreviousNQuarters", "Date.IsInPreviousNWeeks", "Date.IsInPreviousNYears", "Date.IsInPreviousQuarter", "Date.IsInPreviousWeek", "Date.IsInPreviousYear", "Date.IsInYearToDate", "Date.IsLeapYear", "Date.Month", "Date.MonthName", "Date.QuarterOfYear", "Date.StartOfDay", "Date.StartOfMonth", "Date.StartOfQuarter", "Date.StartOfWeek", "Date.StartOfYear", "Date.ToRecord", "Date.ToText", "Date.WeekOfMonth", "Date.WeekOfYear", "Date.Year", "DateTime.AddZone", "DateTime.Date", "DateTime.FixedLocalNow", "DateTime.From", "DateTime.FromFileTime", "DateTime.FromText", "DateTime.IsInCurrentHour", "DateTime.IsInCurrentMinute", "DateTime.IsInCurrentSecond", "DateTime.IsInNextHour", "DateTime.IsInNextMinute", "DateTime.IsInNextNHours", "DateTime.IsInNextNMinutes", "DateTime.IsInNextNSeconds", "DateTime.IsInNextSecond", "DateTime.IsInPreviousHour", "DateTime.IsInPreviousMinute", "DateTime.IsInPreviousNHours", "DateTime.IsInPreviousNMinutes", "DateTime.IsInPreviousNSeconds", "DateTime.IsInPreviousSecond", "DateTime.LocalNow", "DateTime.Time", "DateTime.ToRecord", "DateTime.ToText", "DateTimeZone.FixedLocalNow", "DateTimeZone.FixedUtcNow", "DateTimeZone.From", "DateTimeZone.FromFileTime", "DateTimeZone.FromText", "DateTimeZone.LocalNow", "DateTimeZone.RemoveZone", "DateTimeZone.SwitchZone", "DateTimeZone.ToLocal", "DateTimeZone.ToRecord", "DateTimeZone.ToText", "DateTimeZone.ToUtc", "DateTimeZone.UtcNow", "DateTimeZone.ZoneHours", "DateTimeZone.ZoneMinutes", "Decimal.From", "Diagnostics.ActivityId", "Diagnostics.Trace", "DirectQueryCapabilities.From", "Double.From", "Duration.Days", "Duration.From", "Duration.FromText", "Duration.Hours", "Duration.Minutes", "Duration.Seconds", "Duration.ToRecord", "Duration.ToText", "Duration.TotalDays", "Duration.TotalHours", "Duration.TotalMinutes", "Duration.TotalSeconds", "Embedded.Value", "Error.Record", "Excel.CurrentWorkbook", "Excel.Workbook", "Exchange.Contents", "Expression.Constant", "Expression.Evaluate", "Expression.Identifier", "Facebook.Graph", "File.Contents", "Folder.Contents", "Folder.Files", "Function.From", "Function.Invoke", "Function.InvokeAfter", "Function.IsDataSource", "GoogleAnalytics.Accounts", "Guid.From", "HdInsight.Containers", "HdInsight.Contents", "HdInsight.Files", "Hdfs.Contents", "Hdfs.Files", "Informix.Database", "Int16.From", "Int32.From", "Int64.From", "Int8.From", "ItemExpression.From", "Json.Document", "Json.FromValue", "Lines.FromBinary", "Lines.FromText", "Lines.ToBinary", "Lines.ToText", "List.Accumulate", "List.AllTrue", "List.Alternate", "List.AnyTrue", "List.Average", "List.Buffer", "List.Combine", "List.Contains", "List.ContainsAll", "List.ContainsAny", "List.Count", "List.Covariance", "List.DateTimeZones", "List.DateTimes", "List.Dates", "List.Difference", "List.Distinct", "List.Durations", "List.FindText", "List.First", "List.FirstN", "List.Generate", "List.InsertRange", "List.Intersect", "List.IsDistinct", "List.IsEmpty", "List.Last", "List.LastN", "List.MatchesAll", "List.MatchesAny", "List.Max", "List.MaxN", "List.Median", "List.Min", "List.MinN", "List.Mode", "List.Modes", "List.NonNullCount", "List.Numbers", "List.PositionOf", "List.PositionOfAny", "List.Positions", "List.Product", "List.Random", "List.Range", "List.RemoveFirstN", "List.RemoveItems", "List.RemoveLastN", "List.RemoveMatchingItems", "List.RemoveNulls", "List.RemoveRange", "List.Repeat", "List.ReplaceMatchingItems", "List.ReplaceRange", "List.ReplaceValue", "List.Reverse", "List.Select", "List.Single", "List.SingleOrDefault", "List.Skip", "List.Sort", "List.StandardDeviation", "List.Sum", "List.Times", "List.Transform", "List.TransformMany", "List.Union", "List.Zip", "Logical.From", "Logical.FromText", "Logical.ToText", "MQ.Queue", "MySQL.Database", "Number.Abs", "Number.Acos", "Number.Asin", "Number.Atan", "Number.Atan2", "Number.BitwiseAnd", "Number.BitwiseNot", "Number.BitwiseOr", "Number.BitwiseShiftLeft", "Number.BitwiseShiftRight", "Number.BitwiseXor", "Number.Combinations", "Number.Cos", "Number.Cosh", "Number.Exp", "Number.Factorial", "Number.From", "Number.FromText", "Number.IntegerDivide", "Number.IsEven", "Number.IsNaN", "Number.IsOdd", "Number.Ln", "Number.Log", "Number.Log10", "Number.Mod", "Number.Permutations", "Number.Power", "Number.Random", "Number.RandomBetween", "Number.Round", "Number.RoundAwayFromZero", "Number.RoundDown", "Number.RoundTowardZero", "Number.RoundUp", "Number.Sign", "Number.Sin", "Number.Sinh", "Number.Sqrt", "Number.Tan", "Number.Tanh", "Number.ToText", "OData.Feed", "Odbc.DataSource", "Odbc.Query", "OleDb.DataSource", "OleDb.Query", "Oracle.Database", "Percentage.From", "PostgreSQL.Database", "RData.FromBinary", "Record.AddField", "Record.Combine", "Record.Field", "Record.FieldCount", "Record.FieldNames", "Record.FieldOrDefault", "Record.FieldValues", "Record.FromList", "Record.FromTable", "Record.HasFields", "Record.RemoveFields", "Record.RenameFields", "Record.ReorderFields", "Record.SelectFields", "Record.ToList", "Record.ToTable", "Record.TransformFields", "Replacer.ReplaceText", "Replacer.ReplaceValue", "RowExpression.Column", "RowExpression.From", "Salesforce.Data", "Salesforce.Reports", "SapBusinessWarehouse.Cubes", "SapHana.Database", "SharePoint.Contents", "SharePoint.Files", "SharePoint.Tables", "Single.From", "Soda.Feed", "Splitter.SplitByNothing", "Splitter.SplitTextByAnyDelimiter", "Splitter.SplitTextByDelimiter", "Splitter.SplitTextByEachDelimiter", "Splitter.SplitTextByLengths", "Splitter.SplitTextByPositions", "Splitter.SplitTextByRanges", "Splitter.SplitTextByRepeatedLengths", "Splitter.SplitTextByWhitespace", "Sql.Database", "Sql.Databases", "SqlExpression.SchemaFrom", "SqlExpression.ToExpression", "Sybase.Database", "Table.AddColumn", "Table.AddIndexColumn", "Table.AddJoinColumn", "Table.AddKey", "Table.AggregateTableColumn", "Table.AlternateRows", "Table.Buffer", "Table.Column", "Table.ColumnCount", "Table.ColumnNames", "Table.ColumnsOfType", "Table.Combine", "Table.CombineColumns", "Table.Contains", "Table.ContainsAll", "Table.ContainsAny", "Table.DemoteHeaders", "Table.Distinct", "Table.DuplicateColumn", "Table.ExpandListColumn", "Table.ExpandRecordColumn", "Table.ExpandTableColumn", "Table.FillDown", "Table.FillUp", "Table.FilterWithDataTable", "Table.FindText", "Table.First", "Table.FirstN", "Table.FirstValue", "Table.FromColumns", "Table.FromList", "Table.FromPartitions", "Table.FromRecords", "Table.FromRows", "Table.FromValue", "Table.Group", "Table.HasColumns", "Table.InsertRows", "Table.IsDistinct", "Table.IsEmpty", "Table.Join", "Table.Keys", "Table.Last", "Table.LastN", "Table.MatchesAllRows", "Table.MatchesAnyRows", "Table.Max", "Table.MaxN", "Table.Min", "Table.MinN", "Table.NestedJoin", "Table.Partition", "Table.PartitionValues", "Table.Pivot", "Table.PositionOf", "Table.PositionOfAny", "Table.PrefixColumns", "Table.Profile", "Table.PromoteHeaders", "Table.Range", "Table.RemoveColumns", "Table.RemoveFirstN", "Table.RemoveLastN", "Table.RemoveMatchingRows", "Table.RemoveRows", "Table.RemoveRowsWithErrors", "Table.RenameColumns", "Table.ReorderColumns", "Table.Repeat", "Table.ReplaceErrorValues", "Table.ReplaceKeys", "Table.ReplaceMatchingRows", "Table.ReplaceRelationshipIdentity", "Table.ReplaceRows", "Table.ReplaceValue", "Table.ReverseRows", "Table.RowCount", "Table.Schema", "Table.SelectColumns", "Table.SelectRows", "Table.SelectRowsWithErrors", "Table.SingleRow", "Table.Skip", "Table.Sort", "Table.SplitColumn", "Table.ToColumns", "Table.ToList", "Table.ToRecords", "Table.ToRows", "Table.TransformColumnNames", "Table.TransformColumnTypes", "Table.TransformColumns", "Table.TransformRows", "Table.Transpose", "Table.Unpivot", "Table.UnpivotOtherColumns", "Table.View", "Table.ViewFunction", "TableAction.DeleteRows", "TableAction.InsertRows", "TableAction.UpdateRows", "Tables.GetRelationships", "Teradata.Database", "Text.AfterDelimiter", "Text.At", "Text.BeforeDelimiter", "Text.BetweenDelimiters", "Text.Clean", "Text.Combine", "Text.Contains", "Text.End", "Text.EndsWith", "Text.Format", "Text.From", "Text.FromBinary", "Text.Insert", "Text.Length", "Text.Lower", "Text.Middle", "Text.NewGuid", "Text.PadEnd", "Text.PadStart", "Text.PositionOf", "Text.PositionOfAny", "Text.Proper", "Text.Range", "Text.Remove", "Text.RemoveRange", "Text.Repeat", "Text.Replace", "Text.ReplaceRange", "Text.Select", "Text.Split", "Text.SplitAny", "Text.Start", "Text.StartsWith", "Text.ToBinary", "Text.ToList", "Text.Trim", "Text.TrimEnd", "Text.TrimStart", "Text.Upper", "Time.EndOfHour", "Time.From", "Time.FromText", "Time.Hour", "Time.Minute", "Time.Second", "Time.StartOfHour", "Time.ToRecord", "Time.ToText", "Type.AddTableKey", "Type.ClosedRecord", "Type.Facets", "Type.ForFunction", "Type.ForRecord", "Type.FunctionParameters", "Type.FunctionRequiredParameters", "Type.FunctionReturn", "Type.Is", "Type.IsNullable", "Type.IsOpenRecord", "Type.ListItem", "Type.NonNullable", "Type.OpenRecord", "Type.RecordFields", "Type.ReplaceFacets", "Type.ReplaceTableKeys", "Type.TableColumn", "Type.TableKeys", "Type.TableRow", "Type.TableSchema", "Type.Union", "Uri.BuildQueryString", "Uri.Combine", "Uri.EscapeDataString", "Uri.Parts", "Value.Add", "Value.As", "Value.Compare", "Value.Divide", "Value.Equals", "Value.Firewall", "Value.FromText", "Value.Is", "Value.Metadata", "Value.Multiply", "Value.NativeQuery", "Value.NullableEquals", "Value.RemoveMetadata", "Value.ReplaceMetadata", "Value.ReplaceType", "Value.Subtract", "Value.Type", "ValueAction.NativeStatement", "ValueAction.Replace", "Variable.Value", "Web.Contents", "Web.Page", "WebAction.Request", "Xml.Document", "Xml.Tables"],
  builtinConstants: ["BinaryEncoding.Base64", "BinaryEncoding.Hex", "BinaryOccurrence.Optional", "BinaryOccurrence.Repeating", "BinaryOccurrence.Required", "ByteOrder.BigEndian", "ByteOrder.LittleEndian", "Compression.Deflate", "Compression.GZip", "CsvStyle.QuoteAfterDelimiter", "CsvStyle.QuoteAlways", "Culture.Current", "Day.Friday", "Day.Monday", "Day.Saturday", "Day.Sunday", "Day.Thursday", "Day.Tuesday", "Day.Wednesday", "ExtraValues.Error", "ExtraValues.Ignore", "ExtraValues.List", "GroupKind.Global", "GroupKind.Local", "JoinAlgorithm.Dynamic", "JoinAlgorithm.LeftHash", "JoinAlgorithm.LeftIndex", "JoinAlgorithm.PairwiseHash", "JoinAlgorithm.RightHash", "JoinAlgorithm.RightIndex", "JoinAlgorithm.SortMerge", "JoinKind.FullOuter", "JoinKind.Inner", "JoinKind.LeftAnti", "JoinKind.LeftOuter", "JoinKind.RightAnti", "JoinKind.RightOuter", "JoinSide.Left", "JoinSide.Right", "MissingField.Error", "MissingField.Ignore", "MissingField.UseNull", "Number.E", "Number.Epsilon", "Number.NaN", "Number.NegativeInfinity", "Number.PI", "Number.PositiveInfinity", "Occurrence.All", "Occurrence.First", "Occurrence.Last", "Occurrence.Optional", "Occurrence.Repeating", "Occurrence.Required", "Order.Ascending", "Order.Descending", "Precision.Decimal", "Precision.Double", "QuoteStyle.Csv", "QuoteStyle.None", "RelativePosition.FromEnd", "RelativePosition.FromStart", "RoundingMode.AwayFromZero", "RoundingMode.Down", "RoundingMode.ToEven", "RoundingMode.TowardZero", "RoundingMode.Up", "SapHanaDistribution.All", "SapHanaDistribution.Connection", "SapHanaDistribution.Off", "SapHanaDistribution.Statement", "SapHanaRangeOperator.Equals", "SapHanaRangeOperator.GreaterThan", "SapHanaRangeOperator.GreaterThanOrEquals", "SapHanaRangeOperator.LessThan", "SapHanaRangeOperator.LessThanOrEquals", "SapHanaRangeOperator.NotEquals", "TextEncoding.Ascii", "TextEncoding.BigEndianUnicode", "TextEncoding.Unicode", "TextEncoding.Utf16", "TextEncoding.Utf8", "TextEncoding.Windows", "TraceLevel.Critical", "TraceLevel.Error", "TraceLevel.Information", "TraceLevel.Verbose", "TraceLevel.Warning", "WebMethod.Delete", "WebMethod.Get", "WebMethod.Head", "WebMethod.Patch", "WebMethod.Post", "WebMethod.Put"],
  builtinTypes: ["Action.Type", "Any.Type", "Binary.Type", "BinaryEncoding.Type", "BinaryOccurrence.Type", "Byte.Type", "ByteOrder.Type", "Character.Type", "Compression.Type", "CsvStyle.Type", "Currency.Type", "Date.Type", "DateTime.Type", "DateTimeZone.Type", "Day.Type", "Decimal.Type", "Double.Type", "Duration.Type", "ExtraValues.Type", "Function.Type", "GroupKind.Type", "Guid.Type", "Int16.Type", "Int32.Type", "Int64.Type", "Int8.Type", "JoinAlgorithm.Type", "JoinKind.Type", "JoinSide.Type", "List.Type", "Logical.Type", "MissingField.Type", "None.Type", "Null.Type", "Number.Type", "Occurrence.Type", "Order.Type", "Password.Type", "Percentage.Type", "Precision.Type", "QuoteStyle.Type", "Record.Type", "RelativePosition.Type", "RoundingMode.Type", "SapHanaDistribution.Type", "SapHanaRangeOperator.Type", "Single.Type", "Table.Type", "Text.Type", "TextEncoding.Type", "Time.Type", "TraceLevel.Type", "Type.Type", "Uri.Type", "WebMethod.Type"],
  tokenizer: {
    root: [// quoted identifier
    [/#"[\w \.]+"/, "identifier.quote"], // numbers
    [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"], [/0[xX][0-9a-fA-F]+/, "number.hex"], [/\d+([eE][\-+]?\d+)?/, "number"], // keywords
    [/(#?[a-z]+)\b/, {
      cases: {
        "@typeKeywords": "type",
        "@keywords": "keyword",
        "@constants": "constant",
        "@constructors": "constructor",
        "@operatorKeywords": "operators",
        "@default": "identifier"
      }
    }], // built-in types
    [/\b([A-Z][a-zA-Z0-9]+\.Type)\b/, {
      cases: {
        "@builtinTypes": "type",
        "@default": "identifier"
      }
    }], // other built-ins
    [/\b([A-Z][a-zA-Z0-9]+\.[A-Z][a-zA-Z0-9]+)\b/, {
      cases: {
        "@builtinFunctions": "keyword.function",
        "@builtinConstants": "constant",
        "@default": "identifier"
      }
    }], // other identifiers
    [/\b([a-zA-Z_][\w\.]*)\b/, "identifier"], {
      include: "@whitespace"
    }, {
      include: "@comments"
    }, {
      include: "@strings"
    }, [/[{}()\[\]]/, "@brackets"], [/([=\+<>\-\*&@\?\/!])|([<>]=)|(<>)|(=>)|(\.\.\.)|(\.\.)/, "operators"], [/[,;]/, "delimiter"]],
    whitespace: [[/\s+/, "white"]],
    comments: [["\\/\\*", "comment", "@comment"], ["\\/\\/+.*", "comment"]],
    comment: [["\\*\\/", "comment", "@pop"], [".", "comment"]],
    strings: [["\"", "string", "@string"]],
    string: [["\"\"", "string.escape"], ["\"", "string", "@pop"], [".", "string"]]
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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","node_modules/monaco-editor/esm/vs/basic-languages/powerquery/powerquery.js"], null)
//# sourceMappingURL=/powerquery.4e55ebdd.js.map