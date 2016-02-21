LOW = 0x0;
HIGH = 0x1;

INPUT = 0x0;
OUTPUT = 0x1;
INPUT_PULLUP = 0x2;

function Frame(previousFrame) {
  if (typeof(previousFrame) === "undefined") {
    this.ledModes = {};
    this.ledStates = {};
    this.postDelay = 0;
  } else {
    this.ledModes = {};
    this.ledStates = {};
    for (var prop in previousFrame.ledModes) {
      this.ledModes[prop] = previousFrame.ledModes[prop];
    }
    for (var prop in previousFrame.ledStates) {
      this.ledStates[prop] = previousFrame.ledStates[prop];
    }
    this.postDelay = 0;
  }
}

Frame.prototype.getPinMode = function (pinNumber) {
  if (typeof(this.ledModes[pinNumber]) === "undefined") {
    return INPUT;
  } else {
    return this.ledModes[pinNumber];
  }
};

Frame.prototype.setPinMode = function (pinNumber, mode) {
  this.ledModes[pinNumber] = mode;
};

Frame.prototype.getPinState = function (pinNumber) {
  if (typeof(this.ledStates[pinNumber]) === "undefined") {
    return LOW;
  } else {
    return this.ledStates[pinNumber];
  }
};

Frame.prototype.setPinState = function (pinNumber, state) {
  this.ledStates[pinNumber] = state;
};

function FrameManager() {
  this.frames = [];
  this.frames[0] = new Frame();
  this.currentFrame = 0;
}

FrameManager.prototype.getPinMode = function (pinNumber, frame) {
  if (typeof(frame) === "undefined") {
    this.frames[this.currentFrame].getPinMode(pinNumber);
  } else {
    this.frames[frame].getPinMode(pinNumber);
  }
};

FrameManager.prototype.setPinMode = function (pinNumber, mode) {
  this.frames[this.currentFrame].setPinMode(pinNumber, mode);
};

FrameManager.prototype.getPinState = function (pinNumber, frame) {
  if (typeof(frame) === "undefined") {
    this.frames[this.currentFrame].getPinState(pinNumber);
  } else {
    this.frames[frame].getPinState(pinNumber);
  }
};

FrameManager.prototype.setPinState = function (pinNumber, state) {
  this.frames[this.currentFrame].setPinState(pinNumber, state);
};

FrameManager.prototype.nextFrame = function (delay) {
  this.frames[this.currentFrame].postDelay = delay;
  this.frames.push(new Frame(this.frames[this.currentFrame]));
  this.currentFrame++;
};

var load = function(rt) {
  
  // LED FUNCTIONS ////////////////////////////////////////////////
  
  var gen_int_obj = function (val) {
    return {t: rt.unsignedintTypeLiteral, v: val, left: true};
  };
  
  rt.scope[0]["LOW"] = gen_int_obj(LOW);
  rt.scope[0]["HIGH"] = gen_int_obj(HIGH);
  
  rt.scope[0]["INPUT"] = gen_int_obj(INPUT);
  rt.scope[0]["OUTPUT"] = gen_int_obj(OUTPUT);
  rt.scope[0]["INPUT_PULLUP"] = gen_int_obj(INPUT_PULLUP);
  
  frameManager = new FrameManager();
  
  var pinMode = function (rt, _this, pinNumber, mode) {
    if (mode > 2) {
      rt.raiseException("Unknown mode " + mode.toString());
      return;
    }
    frameManager.setPinMode(pinNumber.v, mode.v);
  };
  rt.regFunc(pinMode, "global", "pinMode", [rt.unsignedintTypeLiteral, rt.unsignedintTypeLiteral], rt.voidTypeLiteral);
  
  var digitalWrite = function (rt, _this, pinNumber, state) {
    if (state > 1) {
      rt.raiseException("Unknown state " + state.toString());
      return;
    }
    frameManager.setPinState(pinNumber.v, state.v);
  };
  rt.regFunc(digitalWrite, "global", "digitalWrite", [rt.unsignedintTypeLiteral, rt.unsignedintTypeLiteral], rt.voidTypeLiteral);
  
  // DELAY ////////////////////////////////////////////////////////
  
  var delay = function (rt, _this, ms) {
    frameManager.nextFrame(ms.v);
  };
  rt.regFunc(delay, "global", "delay", [rt.primitiveType("unsigned long")], rt.voidTypeLiteral);
  
  // STRING ///////////////////////////////////////////////////////
  //Define type
  var string_t = rt.newClass("String", [
    {
      type: rt.normalPointerType(rt.charTypeLiteral),
      name: "buffer"
    }, {
      type: rt.unsignedintTypeLiteral,
      name: "capacity"
    }, {
      type: rt.unsignedintTypeLiteral,
      name: "len"
    }
  ]);
  rt.types[rt.getTypeSignature(string_t)] = {
    "#father": "object"
  };
  var to_char_star = function(rt, _this) {
    return _this.v.members.buffer;
  };
  rt.regFunc(to_char_star, string_t, "toCharStar", [], rt.normalPointerType(rt.charTypeLiteral));
  
  
  // SERIAL ///////////////////////////////////////////////////////
  //Define types
  var print_t = rt.newClass("Print", []);
  rt.types[rt.getTypeSignature(print_t)] = {
    "#father": "object"
  };
  var stream_t = rt.newClass("Stream", []);
  rt.types[rt.getTypeSignature(stream_t)] = {
    "#father": "Print"
  };
  var hs_t = rt.newClass("HardwareSerial", []);
  rt.types[rt.getTypeSignature(hs_t)] = {
    "#father": "Stream"
  };

  //Create serial object
  var serial_obj = {
    t: hs_t,
    v: {
      members: {}
    },
    left: false
  };
  rt.scope[0]["Serial"] = serial_obj;
  
}

arduino_h = {
  load: load
};


function messageHandler(event) {
  var code = event.data;
  var config = {
    includes: {
      "Arduino.h": arduino_h //defined in Arduino.js
    }
  };
  JSCPP.run(code, "", config);
  this.postMessage(JSON.stringify(frameManager));
}

this.addEventListener("message", messageHandler, false);







//JSCPP









(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { TranslationUnit: peg$parseTranslationUnit },
        peg$startRuleFunction  = peg$parseTranslationUnit,

        peg$c0 = function(a) {return addPositionInfo({type:'TranslationUnit', ExternalDeclarations: a});},
        peg$c1 = function(a, b) {
              return addPositionInfo({type: 'NamespaceDefinition', Identifier:a, ExternalDeclarations:b});
            },
        peg$c2 = function(a) {
              return addPositionInfo({type: 'UsingDirective', Identifier:a});
            },
        peg$c3 = function(a, b) {
              return addPositionInfo({type: 'UsingDeclaration', scope: a, Identifier: b});
            },
        peg$c4 = function(a, b) {
              return addPositionInfo({type: 'NamespaceAliasDefinition', target: b, Identifier: a})
            },
        peg$c5 = function(a, b) {return a;},
        peg$c6 = function(a, b, c) {
              return addPositionInfo({type:'TypedefDeclaration', DeclarationSpecifiers:a, Declarators:[b].concat(c)});
            },
        peg$c7 = function(a, b) {return null;},
        peg$c8 = function(a, b, c) {
              return addPositionInfo({type:'FunctionDefinition', DeclarationSpecifiers:a, Declarator:b, CompoundStatement:c});
            },
        peg$c9 = function(a) {return addPositionInfo({type:'DeclarationList', Declarations:a});},
        peg$c10 = function(a) {return addPositionInfo({type: 'Label_case', ConstantExpression: a});},
        peg$c11 = function() {return addPositionInfo({type: 'Label_default'});},
        peg$c12 = function(a) {
                return addPositionInfo({type: 'CompoundStatement', Statements: a});
              },
        peg$c13 = function(a) {
                return addPositionInfo({type: 'ExpressionStatement', Expression: a});
              },
        peg$c14 = function(a, b, c) {
                return addPositionInfo({type: 'SelectionStatement_if', Expression:a, Statement:b, ElseStatement:c?c[1]:null});
              },
        peg$c15 = function(a, b) {
                return addPositionInfo({type: 'SelectionStatement_switch', Expression:a, Statement:b});
              },
        peg$c16 = function(a, b) {return addPositionInfo({type:'IterationStatement_while', Expression:a, Statement:b});},
        peg$c17 = function(a, b) {return addPositionInfo({type:'IterationStatement_do', Expression:b, Statement:a});},
        peg$c18 = function(a, c, d, e) {
              return addPositionInfo({type:'IterationStatement_for', Initializer:a, Expression:c, Loop:d, Statement:e});
            },
        peg$c19 = function(a) {
              return addPositionInfo({type:'JumpStatement_goto', Identifier:a});
            },
        peg$c20 = function() {
              return addPositionInfo({type: 'JumpStatement_continue'});
            },
        peg$c21 = function() {
              return addPositionInfo({type: 'JumpStatement_break'});
            },
        peg$c22 = function(a) {
              return addPositionInfo({type: 'JumpStatement_return', Expression:a});
            },
        peg$c23 = function(a, b) {
              return addPositionInfo({type: 'Declaration', DeclarationSpecifiers:a, InitDeclaratorList:b});
            },
        peg$c24 = function(a, b, c) {
                return a.concat([b]).concat(c);
               },
        peg$c25 = function(a) {
                  return a;
                },
        peg$c26 = function(a) {return a;},
        peg$c27 = function(a) {
                return a;
              },
        peg$c28 = function(a, x) {return x;},
        peg$c29 = function(a, b) {
              return [a].concat(b);
            },
        peg$c30 = function(a, b) {return addPositionInfo({type:'InitDeclarator', Declarator:a, Initializers:b});},
        peg$c31 = function(a) {
              return a;
            },
        peg$c32 = function(a) {return addPositionInfo({type:'Identifier', Identifier:a});},
        peg$c33 = function(a) {
                return addPositionInfo({type:'DirectDeclarator_modifier_ParameterTypeList', ParameterTypeList:a});
              },
        peg$c34 = function(a, b) {
                return addPositionInfo({type:'DirectDeclarator', left:a, right:b});
              },
        peg$c35 = function(a, b) {
              b.Pointer = a;
              return b;
            },
        peg$c36 = function(a, b) {
                return addPositionInfo({type:'DirectDeclarator_modifier_array', Modifier:a||[], Expression: b});
              },
        peg$c37 = function(a, b) {
                return addPositionInfo({type:'DirectDeclarator_modifier_array', Modifier:['static'].concat(a), Expression: b});
              },
        peg$c38 = function(a) {
                return addPositionInfo({type:'DirectDeclarator_modifier_star_array', Modifier:a.concat['*']});
              },
        peg$c39 = function(a) {
                return addPositionInfo({type:'DirectDeclarator_modifier_IdentifierList', IdentifierList:a});
              },
        peg$c40 = function(a, b) {
              return addPositionInfo({type:'ParameterTypeList', ParameterList:a, varargs:b!==null});
            },
        peg$c41 = function(a, b) {
              if (a)
                return [a].concat(b);
              else
                return b;
            },
        peg$c42 = function(a, b) {
                return addPositionInfo({type:'ParameterDeclaration', DeclarationSpecifiers:a, Declarator:b});
              },
        peg$c43 = function(a, b) {
              return addPositionInfo({type: 'TypeName', base: a, extra: b})
            },
        peg$c44 = function(a) {
              return addPositionInfo({type:'AbstractDeclarator', Pointer: a});
            },
        peg$c45 = function(a) {return addPositionInfo({type:'Initializer_expr', Expression:a});},
        peg$c46 = function(a) {return addPositionInfo({type:'Initializer_array', Initializers:a});},
        peg$c47 = function(a, b) {return [a].concat(b);},
        peg$c48 = function(a) {return addPositionInfo({type:'IdentifierExpression', Identifier:a});},
        peg$c49 = function(a) {return addPositionInfo({type:'ConstantExpression', Expression:a});},
        peg$c50 = function(a) {return addPositionInfo({type:'StringLiteralExpression', value:a});},
        peg$c51 = function(a) {return addPositionInfo({type:'ParenthesesExpression', Expression:a});},
        peg$c52 = function(a, c) {return [0,c];},
        peg$c53 = function(a, c) {return [1,c?c:[]];},
        peg$c54 = function(a, c) {return [2,c];},
        peg$c55 = function(a, c) {return [3,c];},
        peg$c56 = function(a, c) {return [4];},
        peg$c57 = function(a, c) {return [5];},
        peg$c58 = function(a, b) {
                if (b.length > 0) {
                  var ret = addPositionInfo({
                    Expression: a,
                  });
                  for (var i = 0; i < b.length; i++){
                    var o = b[i][1];
                    switch(b[i][0]){
                    case 0:
                      ret.type = 'PostfixExpression_ArrayAccess';
                      ret.index = o;
                      break;
                    case 1:
                      ret.type = 'PostfixExpression_MethodInvocation';
                      ret.args = o;
                      break;
                    case 2:
                      ret.type = 'PostfixExpression_MemberAccess';
                      ret.member = o;
                      break;
                    case 3:
                      ret.type = 'PostfixExpression_MemberPointerAccess';
                      ret.member = o;
                      break;
                    case 4:
                      ret.type = 'PostfixExpression_PostIncrement';
                      break;
                    case 5:
                      ret.type = 'PostfixExpression_PostDecrement';
                      break;
                    }
                    ret = addPositionInfo({Expression: ret});
                  }
                  return ret.Expression;
                } else
                  return a;
              },
        peg$c59 = function(a, b) {
              var ret = [a];
              for (var i=0;i<b.length;i++)
                ret.push(b[i][1]);
              return ret;
            },
        peg$c60 = function(a) {return addPositionInfo({type: 'UnaryExpression_PreIncrement', Expression:a});},
        peg$c61 = function(a) {return addPositionInfo({type: 'UnaryExpression_PreDecrement', Expression:a});},
        peg$c62 = function(a, b) {
              return addPositionInfo({type:'UnaryExpression', op:a, Expression:b});
            },
        peg$c63 = function(a) {return addPositionInfo({type:'UnaryExpression_Sizeof_Expr', Expression:a});},
        peg$c64 = function(a) {return addPositionInfo({type:'UnaryExpression_Sizeof_Type', TypeName:a});},
        peg$c65 = function(a, b) {
              return addPositionInfo({type:'CastExpression', TypeName:a[1], Expression:b});
            },
        peg$c66 = function(a, b) {
              return buildRecursiveBinop(a, b);
            },
        peg$c67 = function(a, b) {
              var ret = a;
              for (var i=0;i<b.length;i++) {
                ret = addPositionInfo({type:'ConditionalExpression', cond:ret, t:b[i][1], f:b[i][3]});
              }
              return ret;
            },
        peg$c68 = function(a, b, c) {
              return addPositionInfo({type:'BinOpExpression', op:b, left:a, right:c});
            },
        peg$c69 = function(a) {
                return a.join('');
              },
        peg$c70 = /^[ \n\r\t\x0B\f]/,
        peg$c71 = { type: "class", value: "[ \\n\\r\\t\\u000B\\u000C]", description: "[ \\n\\r\\t\\u000B\\u000C]" },
        peg$c72 = "/*",
        peg$c73 = { type: "literal", value: "/*", description: "\"/*\"" },
        peg$c74 = "*/",
        peg$c75 = { type: "literal", value: "*/", description: "\"*/\"" },
        peg$c76 = function(a) {return a.join('');},
        peg$c77 = "//",
        peg$c78 = { type: "literal", value: "//", description: "\"//\"" },
        peg$c79 = "\n",
        peg$c80 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c81 = "auto",
        peg$c82 = { type: "literal", value: "auto", description: "\"auto\"" },
        peg$c83 = "break",
        peg$c84 = { type: "literal", value: "break", description: "\"break\"" },
        peg$c85 = "case",
        peg$c86 = { type: "literal", value: "case", description: "\"case\"" },
        peg$c87 = "char",
        peg$c88 = { type: "literal", value: "char", description: "\"char\"" },
        peg$c89 = "const",
        peg$c90 = { type: "literal", value: "const", description: "\"const\"" },
        peg$c91 = "continue",
        peg$c92 = { type: "literal", value: "continue", description: "\"continue\"" },
        peg$c93 = "default",
        peg$c94 = { type: "literal", value: "default", description: "\"default\"" },
        peg$c95 = "double",
        peg$c96 = { type: "literal", value: "double", description: "\"double\"" },
        peg$c97 = "do",
        peg$c98 = { type: "literal", value: "do", description: "\"do\"" },
        peg$c99 = "else",
        peg$c100 = { type: "literal", value: "else", description: "\"else\"" },
        peg$c101 = "enum",
        peg$c102 = { type: "literal", value: "enum", description: "\"enum\"" },
        peg$c103 = "extern",
        peg$c104 = { type: "literal", value: "extern", description: "\"extern\"" },
        peg$c105 = "float",
        peg$c106 = { type: "literal", value: "float", description: "\"float\"" },
        peg$c107 = "for",
        peg$c108 = { type: "literal", value: "for", description: "\"for\"" },
        peg$c109 = "goto",
        peg$c110 = { type: "literal", value: "goto", description: "\"goto\"" },
        peg$c111 = "if",
        peg$c112 = { type: "literal", value: "if", description: "\"if\"" },
        peg$c113 = "int",
        peg$c114 = { type: "literal", value: "int", description: "\"int\"" },
        peg$c115 = "inline",
        peg$c116 = { type: "literal", value: "inline", description: "\"inline\"" },
        peg$c117 = "long",
        peg$c118 = { type: "literal", value: "long", description: "\"long\"" },
        peg$c119 = "register",
        peg$c120 = { type: "literal", value: "register", description: "\"register\"" },
        peg$c121 = "restrict",
        peg$c122 = { type: "literal", value: "restrict", description: "\"restrict\"" },
        peg$c123 = "return",
        peg$c124 = { type: "literal", value: "return", description: "\"return\"" },
        peg$c125 = "short",
        peg$c126 = { type: "literal", value: "short", description: "\"short\"" },
        peg$c127 = "signed",
        peg$c128 = { type: "literal", value: "signed", description: "\"signed\"" },
        peg$c129 = "sizeof",
        peg$c130 = { type: "literal", value: "sizeof", description: "\"sizeof\"" },
        peg$c131 = "static",
        peg$c132 = { type: "literal", value: "static", description: "\"static\"" },
        peg$c133 = "struct",
        peg$c134 = { type: "literal", value: "struct", description: "\"struct\"" },
        peg$c135 = "switch",
        peg$c136 = { type: "literal", value: "switch", description: "\"switch\"" },
        peg$c137 = "typedef",
        peg$c138 = { type: "literal", value: "typedef", description: "\"typedef\"" },
        peg$c139 = "union",
        peg$c140 = { type: "literal", value: "union", description: "\"union\"" },
        peg$c141 = "unsigned",
        peg$c142 = { type: "literal", value: "unsigned", description: "\"unsigned\"" },
        peg$c143 = "void",
        peg$c144 = { type: "literal", value: "void", description: "\"void\"" },
        peg$c145 = "volatile",
        peg$c146 = { type: "literal", value: "volatile", description: "\"volatile\"" },
        peg$c147 = "while",
        peg$c148 = { type: "literal", value: "while", description: "\"while\"" },
        peg$c149 = "_Bool",
        peg$c150 = { type: "literal", value: "_Bool", description: "\"_Bool\"" },
        peg$c151 = "_Complex",
        peg$c152 = { type: "literal", value: "_Complex", description: "\"_Complex\"" },
        peg$c153 = "_stdcall",
        peg$c154 = { type: "literal", value: "_stdcall", description: "\"_stdcall\"" },
        peg$c155 = "__declspec",
        peg$c156 = { type: "literal", value: "__declspec", description: "\"__declspec\"" },
        peg$c157 = "__attribute__",
        peg$c158 = { type: "literal", value: "__attribute__", description: "\"__attribute__\"" },
        peg$c159 = "namespace",
        peg$c160 = { type: "literal", value: "namespace", description: "\"namespace\"" },
        peg$c161 = "using",
        peg$c162 = { type: "literal", value: "using", description: "\"using\"" },
        peg$c163 = "true",
        peg$c164 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c165 = "false",
        peg$c166 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c167 = "_Imaginary",
        peg$c168 = { type: "literal", value: "_Imaginary", description: "\"_Imaginary\"" },
        peg$c169 = function(a, b, c) {
              var scope = a ? "global" : null;

              for (var i = 0;i<b.length;i++) {
                scope = addPositionInfo({type: "ScopedIdentifier", scope: scope, Identifier: b[i]})
              }

              return addPositionInfo({type: "ScopedIdentifier", scope:scope, Identifier: c});
            },
        peg$c170 = function(a, b) {return a+b.join('')},
        peg$c171 = /^[a-z]/,
        peg$c172 = { type: "class", value: "[a-z]", description: "[a-z]" },
        peg$c173 = /^[A-Z]/,
        peg$c174 = { type: "class", value: "[A-Z]", description: "[A-Z]" },
        peg$c175 = /^[_]/,
        peg$c176 = { type: "class", value: "[_]", description: "[_]" },
        peg$c177 = /^[0-9]/,
        peg$c178 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c179 = "\\u",
        peg$c180 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c181 = "\\U",
        peg$c182 = { type: "literal", value: "\\U", description: "\"\\\\U\"" },
        peg$c183 = function(a) {
              return addPositionInfo({type:'BooleanConstant', value:a});
            },
        peg$c184 = /^[1-9]/,
        peg$c185 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c186 = function(a, b) {return addPositionInfo({type:'DecimalConstant', value:a + b.join("")});},
        peg$c187 = "0",
        peg$c188 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c189 = /^[0-7]/,
        peg$c190 = { type: "class", value: "[0-7]", description: "[0-7]" },
        peg$c191 = function(a) {
          if (a.length>0)
            return addPositionInfo({type:'OctalConstant', value:a.join("")});
          else
            return addPositionInfo({type:'OctalConstant', value:'0'});
        },
        peg$c192 = function(a) {return addPositionInfo({type:'HexConstant', value:a.join("")});},
        peg$c193 = "0x",
        peg$c194 = { type: "literal", value: "0x", description: "\"0x\"" },
        peg$c195 = "0X",
        peg$c196 = { type: "literal", value: "0X", description: "\"0X\"" },
        peg$c197 = /^[a-f]/,
        peg$c198 = { type: "class", value: "[a-f]", description: "[a-f]" },
        peg$c199 = /^[A-F]/,
        peg$c200 = { type: "class", value: "[A-F]", description: "[A-F]" },
        peg$c201 = "0b",
        peg$c202 = { type: "literal", value: "0b", description: "\"0b\"" },
        peg$c203 = /^[0-1]/,
        peg$c204 = { type: "class", value: "[0-1]", description: "[0-1]" },
        peg$c205 = function(a) {return addPositionInfo({type:'BinaryConstant', value:a.join("")});},
        peg$c206 = /^[uU]/,
        peg$c207 = { type: "class", value: "[uU]", description: "[uU]" },
        peg$c208 = "ll",
        peg$c209 = { type: "literal", value: "ll", description: "\"ll\"" },
        peg$c210 = "LL",
        peg$c211 = { type: "literal", value: "LL", description: "\"LL\"" },
        peg$c212 = /^[lL]/,
        peg$c213 = { type: "class", value: "[lL]", description: "[lL]" },
        peg$c214 = function(a, b) {
              if (b)
                return addPositionInfo({type:'FloatConstant', Expression:a});
              else
                return a;
            },
        peg$c215 = function(a, b) {return addPositionInfo({type:'DecimalFloatConstant', value:a+b||''});},
        peg$c216 = function(a, b) {return addPositionInfo({type:'DecimalFloatConstant', value:a.join('')+b});},
        peg$c217 = function(a, b, c) {return addPositionInfo({type:'HexFloatConstant', value:a+b+c||''});},
        peg$c218 = function(a, b, c) {return addPositionInfo({type:'HexFloatConstant', value:a+b.join('')+c});},
        peg$c219 = ".",
        peg$c220 = { type: "literal", value: ".", description: "\".\"" },
        peg$c221 = function(a, b) {return a.join('')+'.'+b.join('');},
        peg$c222 = function(a) {return a.join('')+'.';},
        peg$c223 = /^[eE]/,
        peg$c224 = { type: "class", value: "[eE]", description: "[eE]" },
        peg$c225 = /^[+\-]/,
        peg$c226 = { type: "class", value: "[+\\-]", description: "[+\\-]" },
        peg$c227 = function(a, b, c) {return a+(b||"")+c.join('');},
        peg$c228 = /^[pP]/,
        peg$c229 = { type: "class", value: "[pP]", description: "[pP]" },
        peg$c230 = function(a, b) {return a+b.join('');},
        peg$c231 = /^[flFL]/,
        peg$c232 = { type: "class", value: "[flFL]", description: "[flFL]" },
        peg$c233 = function(a) {return addPositionInfo({type:'EnumerationConstant', Identifier:a});},
        peg$c234 = "L",
        peg$c235 = { type: "literal", value: "L", description: "\"L\"" },
        peg$c236 = "'",
        peg$c237 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c238 = function(a) {
          return addPositionInfo({type:'CharacterConstant', Char: a});
        },
        peg$c239 = /^['\n\\]/,
        peg$c240 = { type: "class", value: "['\\n\\\\]", description: "['\\n\\\\]" },
        peg$c241 = "\\",
        peg$c242 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c243 = /^['"?\\abfnrtv]/,
        peg$c244 = { type: "class", value: "['\\\"?\\\\abfnrtv]", description: "['\\\"?\\\\abfnrtv]" },
        peg$c245 = function(a, b) {return eval('"' + a + b +'"');},
        peg$c246 = function(a, b, c, d) {
          var ret = "\"";
          ret += a;
          ret += b;
          if (c)
            ret += c;
          if (d)
            ret += d;
          ret += "\"";
          return eval(ret);
        },
        peg$c247 = "\\x",
        peg$c248 = { type: "literal", value: "\\x", description: "\"\\\\x\"" },
        peg$c249 = function(a, b) {return eval('"'+a+b.join('')+'"');},
        peg$c250 = "u8",
        peg$c251 = { type: "literal", value: "u8", description: "\"u8\"" },
        peg$c252 = "u",
        peg$c253 = { type: "literal", value: "u", description: "\"u\"" },
        peg$c254 = "U",
        peg$c255 = { type: "literal", value: "U", description: "\"U\"" },
        peg$c256 = function(a, b) {
          return addPositionInfo({type: 'StringLiteral', prefix:a, value:b});
        },
        peg$c257 = "R",
        peg$c258 = { type: "literal", value: "R", description: "\"R\"" },
        peg$c259 = /^["]/,
        peg$c260 = { type: "class", value: "[\"]", description: "[\"]" },
        peg$c261 = function(a) {
          return a.join('');
        },
        peg$c262 = /^["\n]/,
        peg$c263 = { type: "class", value: "[\\\"\\n]", description: "[\\\"\\n]" },
        peg$c264 = /^["\n\\]/,
        peg$c265 = { type: "class", value: "[\\\"\\n\\\\]", description: "[\\\"\\n\\\\]" },
        peg$c266 = "[",
        peg$c267 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c268 = "]",
        peg$c269 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c270 = "(",
        peg$c271 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c272 = ")",
        peg$c273 = { type: "literal", value: ")", description: "\")\"" },
        peg$c274 = "{",
        peg$c275 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c276 = "}",
        peg$c277 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c278 = "->",
        peg$c279 = { type: "literal", value: "->", description: "\"->\"" },
        peg$c280 = "++",
        peg$c281 = { type: "literal", value: "++", description: "\"++\"" },
        peg$c282 = "--",
        peg$c283 = { type: "literal", value: "--", description: "\"--\"" },
        peg$c284 = "&",
        peg$c285 = { type: "literal", value: "&", description: "\"&\"" },
        peg$c286 = /^[&]/,
        peg$c287 = { type: "class", value: "[&]", description: "[&]" },
        peg$c288 = "*",
        peg$c289 = { type: "literal", value: "*", description: "\"*\"" },
        peg$c290 = /^[=]/,
        peg$c291 = { type: "class", value: "[=]", description: "[=]" },
        peg$c292 = "+",
        peg$c293 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c294 = /^[+=]/,
        peg$c295 = { type: "class", value: "[+=]", description: "[+=]" },
        peg$c296 = "-",
        peg$c297 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c298 = /^[\-=>]/,
        peg$c299 = { type: "class", value: "[\\-=>]", description: "[\\-=>]" },
        peg$c300 = "~",
        peg$c301 = { type: "literal", value: "~", description: "\"~\"" },
        peg$c302 = "!",
        peg$c303 = { type: "literal", value: "!", description: "\"!\"" },
        peg$c304 = "/",
        peg$c305 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c306 = "%",
        peg$c307 = { type: "literal", value: "%", description: "\"%\"" },
        peg$c308 = /^[=>]/,
        peg$c309 = { type: "class", value: "[=>]", description: "[=>]" },
        peg$c310 = "<<",
        peg$c311 = { type: "literal", value: "<<", description: "\"<<\"" },
        peg$c312 = ">>",
        peg$c313 = { type: "literal", value: ">>", description: "\">>\"" },
        peg$c314 = "<",
        peg$c315 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c316 = ">",
        peg$c317 = { type: "literal", value: ">", description: "\">\"" },
        peg$c318 = "<=",
        peg$c319 = { type: "literal", value: "<=", description: "\"<=\"" },
        peg$c320 = ">=",
        peg$c321 = { type: "literal", value: ">=", description: "\">=\"" },
        peg$c322 = "==",
        peg$c323 = { type: "literal", value: "==", description: "\"==\"" },
        peg$c324 = "!=",
        peg$c325 = { type: "literal", value: "!=", description: "\"!=\"" },
        peg$c326 = "^",
        peg$c327 = { type: "literal", value: "^", description: "\"^\"" },
        peg$c328 = "|",
        peg$c329 = { type: "literal", value: "|", description: "\"|\"" },
        peg$c330 = "&&",
        peg$c331 = { type: "literal", value: "&&", description: "\"&&\"" },
        peg$c332 = "||",
        peg$c333 = { type: "literal", value: "||", description: "\"||\"" },
        peg$c334 = "?",
        peg$c335 = { type: "literal", value: "?", description: "\"?\"" },
        peg$c336 = ":",
        peg$c337 = { type: "literal", value: ":", description: "\":\"" },
        peg$c338 = /^[>]/,
        peg$c339 = { type: "class", value: "[>]", description: "[>]" },
        peg$c340 = ";",
        peg$c341 = { type: "literal", value: ";", description: "\";\"" },
        peg$c342 = "...",
        peg$c343 = { type: "literal", value: "...", description: "\"...\"" },
        peg$c344 = "=",
        peg$c345 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c346 = "*=",
        peg$c347 = { type: "literal", value: "*=", description: "\"*=\"" },
        peg$c348 = "/=",
        peg$c349 = { type: "literal", value: "/=", description: "\"/=\"" },
        peg$c350 = "%=",
        peg$c351 = { type: "literal", value: "%=", description: "\"%=\"" },
        peg$c352 = "+=",
        peg$c353 = { type: "literal", value: "+=", description: "\"+=\"" },
        peg$c354 = "-=",
        peg$c355 = { type: "literal", value: "-=", description: "\"-=\"" },
        peg$c356 = "<<=",
        peg$c357 = { type: "literal", value: "<<=", description: "\"<<=\"" },
        peg$c358 = ">>=",
        peg$c359 = { type: "literal", value: ">>=", description: "\">>=\"" },
        peg$c360 = "&=",
        peg$c361 = { type: "literal", value: "&=", description: "\"&=\"" },
        peg$c362 = "^=",
        peg$c363 = { type: "literal", value: "^=", description: "\"^=\"" },
        peg$c364 = "|=",
        peg$c365 = { type: "literal", value: "|=", description: "\"|=\"" },
        peg$c366 = ",",
        peg$c367 = { type: "literal", value: ",", description: "\",\"" },
        peg$c368 = "::",
        peg$c369 = { type: "literal", value: "::", description: "\"::\"" },
        peg$c370 = { type: "any", description: "any character" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseTranslationUnit() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseSpacing();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseExternalDeclaration();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseExternalDeclaration();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEOT();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseExternalDeclaration() {
      var s0;

      s0 = peg$parseNamespace();
      if (s0 === peg$FAILED) {
        s0 = peg$parseTypedefDeclaration();
        if (s0 === peg$FAILED) {
          s0 = peg$parseFunctionDefinition();
          if (s0 === peg$FAILED) {
            s0 = peg$parseDeclaration();
          }
        }
      }

      return s0;
    }

    function peg$parseNamespace() {
      var s0;

      s0 = peg$parseNamespaceDefinition();
      if (s0 === peg$FAILED) {
        s0 = peg$parseUsingDirective();
        if (s0 === peg$FAILED) {
          s0 = peg$parseUsingDeclaration();
          if (s0 === peg$FAILED) {
            s0 = peg$parseNamespaceAliasDefinition();
          }
        }
      }

      return s0;
    }

    function peg$parseNamespaceDefinition() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseNAMESPACE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseLWING();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseExternalDeclaration();
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseExternalDeclaration();
              }
            } else {
              s4 = peg$FAILED;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseRWING();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c1(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUsingDirective() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseUSING();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNAMESPACE();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseScopedIdentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSEMI();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c2(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUsingDeclaration() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseUSING();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseScopedIdentifier();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSCOPEOP();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseIdentifier();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSEMI();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c3(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseNamespaceAliasDefinition() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseNAMESPACE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEQU();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseScopedIdentifier();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSEMI();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c4(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTypedefDeclaration() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseTYPEDEF();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDeclarationSpecifiers();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseDeclarator();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$currPos;
            s6 = peg$parseCOMMA();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseDeclarator();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c5(s7, s3);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$currPos;
              s6 = peg$parseCOMMA();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseDeclarator();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s5;
                  s6 = peg$c5(s7, s3);
                  s5 = s6;
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSEMI();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s2, s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFunctionDefinition() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseDeclarationSpecifiers();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFunctionDirectDeclarator();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseSEMI();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c7(s1, s2);
          }
          s3 = s4;
          if (s3 === peg$FAILED) {
            s3 = peg$parseCompoundStatement();
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c8(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDeclarationList() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseDeclaration();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseDeclaration();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseStatementORDeclaration() {
      var s0;

      s0 = peg$parseStatement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseDeclaration();
      }

      return s0;
    }

    function peg$parseStatement() {
      var s0;

      s0 = peg$parseLabel();
      if (s0 === peg$FAILED) {
        s0 = peg$parseCompoundStatement();
        if (s0 === peg$FAILED) {
          s0 = peg$parseExpressionStatement();
          if (s0 === peg$FAILED) {
            s0 = peg$parseSelectionStatement();
            if (s0 === peg$FAILED) {
              s0 = peg$parseIterationStatement();
              if (s0 === peg$FAILED) {
                s0 = peg$parseJumpStatement();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseLabel() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseCASE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseConditionalExpression();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseCOLON();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c10(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseDEFAULT();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseCOLON();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c11();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseCompoundStatement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseLWING();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseStatement();
        if (s3 === peg$FAILED) {
          s3 = peg$parseDeclaration();
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseStatement();
          if (s3 === peg$FAILED) {
            s3 = peg$parseDeclaration();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseRWING();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c12(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseExpressionStatement() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseExpression();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSEMI();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c13(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSelectionStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseIF();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLPAR();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseStatement();
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                s7 = peg$parseELSE();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseStatement();
                  if (s8 !== peg$FAILED) {
                    s7 = [s7, s8];
                    s6 = s7;
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
                if (s6 === peg$FAILED) {
                  s6 = null;
                }
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c14(s3, s5, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseSWITCH();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLPAR();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseExpression();
            if (s3 !== peg$FAILED) {
              s4 = peg$parseRPAR();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseStatement();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c15(s3, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseIterationStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseWHILE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLPAR();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseStatement();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c16(s3, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseDO();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseStatement();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseWHILE();
            if (s3 !== peg$FAILED) {
              s4 = peg$parseLPAR();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseExpression();
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseRPAR();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseSEMI();
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c17(s2, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseFOR();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseLPAR();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseDeclaration();
              if (s3 === peg$FAILED) {
                s3 = peg$parseExpressionStatement();
              }
              if (s3 === peg$FAILED) {
                s3 = null;
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseExpression();
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseSEMI();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseExpression();
                    if (s6 === peg$FAILED) {
                      s6 = null;
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseRPAR();
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parseStatement();
                        if (s8 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c18(s3, s4, s6, s8);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }

      return s0;
    }

    function peg$parseJumpStatement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseGOTO();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSEMI();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c19(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseCONTINUE();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseSEMI();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c20();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseBREAK();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseSEMI();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c21();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseRETURN();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseExpression();
              if (s2 === peg$FAILED) {
                s2 = null;
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parseSEMI();
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c22(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }

      return s0;
    }

    function peg$parseDeclaration() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseDeclarationSpecifiers();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInitDeclaratorList();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSEMI();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c23(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDeclarationSpecifiers() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      s3 = peg$parseStorageClassSpecifier();
      if (s3 === peg$FAILED) {
        s3 = peg$parseTypeQualifier();
        if (s3 === peg$FAILED) {
          s3 = peg$parseFunctionSpecifier();
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseStorageClassSpecifier();
        if (s3 === peg$FAILED) {
          s3 = peg$parseTypeQualifier();
          if (s3 === peg$FAILED) {
            s3 = peg$parseFunctionSpecifier();
          }
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseIdentifier();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseStorageClassSpecifier();
          if (s5 === peg$FAILED) {
            s5 = peg$parseTypeQualifier();
            if (s5 === peg$FAILED) {
              s5 = peg$parseFunctionSpecifier();
            }
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseStorageClassSpecifier();
            if (s5 === peg$FAILED) {
              s5 = peg$parseTypeQualifier();
              if (s5 === peg$FAILED) {
                s5 = peg$parseFunctionSpecifier();
              }
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s1;
            s2 = peg$c24(s2, s3, s4);
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c25(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$parseStorageClassSpecifier();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s2;
          s3 = peg$c26(s3);
        }
        s2 = s3;
        if (s2 === peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseTypeSpecifier();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c26(s3);
          }
          s2 = s3;
          if (s2 === peg$FAILED) {
            s2 = peg$currPos;
            s3 = peg$parseTypeQualifier();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s2;
              s3 = peg$c26(s3);
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
              s2 = peg$currPos;
              s3 = peg$parseFunctionSpecifier();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c26(s3);
              }
              s2 = s3;
            }
          }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$parseStorageClassSpecifier();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s2;
              s3 = peg$c26(s3);
            }
            s2 = s3;
            if (s2 === peg$FAILED) {
              s2 = peg$currPos;
              s3 = peg$parseTypeSpecifier();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c26(s3);
              }
              s2 = s3;
              if (s2 === peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseTypeQualifier();
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c26(s3);
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$parseFunctionSpecifier();
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c26(s3);
                  }
                  s2 = s3;
                }
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c27(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseInitDeclaratorList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseInitDeclarator();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseInitDeclarator();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c28(s1, s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseInitDeclarator();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c28(s1, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c29(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseInitDeclarator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseDeclarator();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseEQU();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseInitializer();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c28(s1, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c30(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseStorageClassSpecifier() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parseEXTERN();
      if (s1 === peg$FAILED) {
        s1 = peg$parseSTATIC();
        if (s1 === peg$FAILED) {
          s1 = peg$parseAUTO();
          if (s1 === peg$FAILED) {
            s1 = peg$parseREGISTER();
            if (s1 === peg$FAILED) {
              s1 = peg$currPos;
              s2 = peg$parseATTRIBUTE();
              if (s2 !== peg$FAILED) {
                s3 = peg$parseLPAR();
                if (s3 !== peg$FAILED) {
                  s4 = peg$parseLPAR();
                  if (s4 !== peg$FAILED) {
                    s5 = [];
                    s6 = peg$currPos;
                    s7 = peg$currPos;
                    peg$silentFails++;
                    s8 = peg$parseRPAR();
                    peg$silentFails--;
                    if (s8 === peg$FAILED) {
                      s7 = void 0;
                    } else {
                      peg$currPos = s7;
                      s7 = peg$FAILED;
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_();
                      if (s8 !== peg$FAILED) {
                        s7 = [s7, s8];
                        s6 = s7;
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                    while (s6 !== peg$FAILED) {
                      s5.push(s6);
                      s6 = peg$currPos;
                      s7 = peg$currPos;
                      peg$silentFails++;
                      s8 = peg$parseRPAR();
                      peg$silentFails--;
                      if (s8 === peg$FAILED) {
                        s7 = void 0;
                      } else {
                        peg$currPos = s7;
                        s7 = peg$FAILED;
                      }
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parse_();
                        if (s8 !== peg$FAILED) {
                          s7 = [s7, s8];
                          s6 = s7;
                        } else {
                          peg$currPos = s6;
                          s6 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    }
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parseRPAR();
                      if (s6 !== peg$FAILED) {
                        s7 = peg$parseRPAR();
                        if (s7 !== peg$FAILED) {
                          s2 = [s2, s3, s4, s5, s6, s7];
                          s1 = s2;
                        } else {
                          peg$currPos = s1;
                          s1 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseTypeSpecifier() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseVOID();
      if (s1 === peg$FAILED) {
        s1 = peg$parseCHAR();
        if (s1 === peg$FAILED) {
          s1 = peg$parseSHORT();
          if (s1 === peg$FAILED) {
            s1 = peg$parseINT();
            if (s1 === peg$FAILED) {
              s1 = peg$parseLONG();
              if (s1 === peg$FAILED) {
                s1 = peg$parseFLOAT();
                if (s1 === peg$FAILED) {
                  s1 = peg$parseDOUBLE();
                  if (s1 === peg$FAILED) {
                    s1 = peg$parseSIGNED();
                    if (s1 === peg$FAILED) {
                      s1 = peg$parseUNSIGNED();
                      if (s1 === peg$FAILED) {
                        s1 = peg$parseBOOL();
                        if (s1 === peg$FAILED) {
                          s1 = peg$parseCOMPLEX();
                          if (s1 === peg$FAILED) {
                            s1 = peg$parseStructOrUnionSpecifier();
                            if (s1 === peg$FAILED) {
                              s1 = peg$parseEnumSpecifier();
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseStructOrUnionSpecifier() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseStructOrUnion();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseIdentifier();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseLWING();
          if (s4 !== peg$FAILED) {
            s5 = [];
            s6 = peg$parseStructDeclaration();
            if (s6 !== peg$FAILED) {
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseStructDeclaration();
              }
            } else {
              s5 = peg$FAILED;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRWING();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c27(s3);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$parseIdentifier();
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseStructOrUnion() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseSTRUCT();
      if (s1 === peg$FAILED) {
        s1 = peg$parseUNION();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseStructDeclaration() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseSpecifierQualifierList();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseStructDeclaratorList();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSEMI();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSpecifierQualifierList() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseTypeQualifier();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseTypeQualifier();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseTypeQualifier();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseTypeQualifier();
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = [];
        s1 = peg$parseTypeSpecifier();
        if (s1 === peg$FAILED) {
          s1 = peg$parseTypeQualifier();
        }
        if (s1 !== peg$FAILED) {
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            s1 = peg$parseTypeSpecifier();
            if (s1 === peg$FAILED) {
              s1 = peg$parseTypeQualifier();
            }
          }
        } else {
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseStructDeclaratorList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseStructDeclarator();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseStructDeclarator();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseStructDeclarator();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseStructDeclarator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseDeclarator();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseCOLON();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseConditionalExpression();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseDeclarator();
      }

      return s0;
    }

    function peg$parseEnumSpecifier() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseENUM();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseIdentifier();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseLWING();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseEnumeratorList();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseCOMMA();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseRWING();
                if (s7 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6, s7];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$parseIdentifier();
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEnumeratorList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseEnumerator();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseEnumerator();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseEnumerator();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEnumerator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseEnumerationConstant();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseEQU();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseConditionalExpression();
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTypeQualifier() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseCONST();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseFunctionSpecifier() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseINLINE();
      if (s1 === peg$FAILED) {
        s1 = peg$parseSTDCALL();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseFunctionDirectDeclarator() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseIdentifier();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c32(s2);
      }
      s1 = s2;
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$parseLPAR();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseDeclarator();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c26(s3);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseLPAR();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseParameterTypeList();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseRPAR();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s2;
              s3 = peg$c33(s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c34(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDeclarator() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsePointer();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDirectDeclarator();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c35(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDirectDeclarator() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseIdentifier();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c32(s2);
      }
      s1 = s2;
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$parseLPAR();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseDeclarator();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c26(s3);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLBRK();
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parseTypeQualifier();
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            s6 = peg$parseTypeQualifier();
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseAssignmentExpression();
            if (s6 === peg$FAILED) {
              s6 = null;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseRBRK();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c36(s5, s6);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 === peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseLBRK();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSTATIC();
            if (s5 !== peg$FAILED) {
              s6 = [];
              s7 = peg$parseTypeQualifier();
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$parseTypeQualifier();
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseAssignmentExpression();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseRBRK();
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c37(s6, s7);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseLBRK();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseTypeQualifier();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseTypeQualifier();
                }
              } else {
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseSTATIC();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseAssignmentExpression();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseRBRK();
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s3;
                      s4 = peg$c37(s5, s7);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              s4 = peg$parseLBRK();
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseTypeQualifier();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseTypeQualifier();
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseSTAR();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseRBRK();
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s3;
                      s4 = peg$c38(s5);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
              if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$parseLPAR();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseParameterTypeList();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseRPAR();
                    if (s6 !== peg$FAILED) {
                      peg$savedPos = s3;
                      s4 = peg$c33(s5);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                  s3 = peg$currPos;
                  s4 = peg$parseLPAR();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parseIdentifierList();
                    if (s5 === peg$FAILED) {
                      s5 = null;
                    }
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parseRPAR();
                      if (s6 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c39(s5);
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                }
              }
            }
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLBRK();
          if (s4 !== peg$FAILED) {
            s5 = [];
            s6 = peg$parseTypeQualifier();
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parseTypeQualifier();
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseAssignmentExpression();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseRBRK();
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c36(s5, s6);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseLBRK();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSTATIC();
              if (s5 !== peg$FAILED) {
                s6 = [];
                s7 = peg$parseTypeQualifier();
                while (s7 !== peg$FAILED) {
                  s6.push(s7);
                  s7 = peg$parseTypeQualifier();
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseAssignmentExpression();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseRBRK();
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s3;
                      s4 = peg$c37(s6, s7);
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              s4 = peg$parseLBRK();
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseTypeQualifier();
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseTypeQualifier();
                  }
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseSTATIC();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseAssignmentExpression();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parseRBRK();
                      if (s8 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c37(s5, s7);
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
              if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$parseLBRK();
                if (s4 !== peg$FAILED) {
                  s5 = [];
                  s6 = peg$parseTypeQualifier();
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$parseTypeQualifier();
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseSTAR();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseRBRK();
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c38(s5);
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                  s3 = peg$currPos;
                  s4 = peg$parseLPAR();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parseParameterTypeList();
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parseRPAR();
                      if (s6 !== peg$FAILED) {
                        peg$savedPos = s3;
                        s4 = peg$c33(s5);
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                  if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseLPAR();
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parseIdentifierList();
                      if (s5 === peg$FAILED) {
                        s5 = null;
                      }
                      if (s5 !== peg$FAILED) {
                        s6 = peg$parseRPAR();
                        if (s6 !== peg$FAILED) {
                          peg$savedPos = s3;
                          s4 = peg$c39(s5);
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  }
                }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c34(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePointer() {
      var s0, s1, s2, s3, s4;

      s0 = [];
      s1 = peg$currPos;
      s2 = peg$parseSTAR();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseTypeQualifier();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parseTypeQualifier();
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s1;
          s2 = peg$c26(s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$currPos;
          s2 = peg$parseSTAR();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseTypeQualifier();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseTypeQualifier();
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c26(s3);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseParameterTypeList() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseParameterList();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseCOMMA();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseELLIPSIS();
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c40(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseParameterList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseParameterDeclaration();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseParameterDeclaration();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c26(s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseParameterDeclaration();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c26(s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c41(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseParameterDeclaration() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseDeclarationSpecifiers();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDeclarator();
        if (s2 === peg$FAILED) {
          s2 = peg$parseAbstractDeclarator();
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c42(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIdentifierList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseIdentifier();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c28(s1, s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseIdentifier();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c28(s1, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c29(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTypeName() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseSpecifierQualifierList();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseAbstractDeclarator();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c43(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAbstractDeclarator() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsePointer();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDirectAbstractDeclarator();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c35(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsePointer();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseDirectAbstractDeclarator() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseLPAR();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseAbstractDeclarator();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseRPAR();
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$parseLBRK();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAssignmentExpression();
          if (s3 === peg$FAILED) {
            s3 = peg$parseSTAR();
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRBRK();
            if (s4 !== peg$FAILED) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 === peg$FAILED) {
          s1 = peg$currPos;
          s2 = peg$parseLPAR();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseParameterTypeList();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parseRPAR();
              if (s4 !== peg$FAILED) {
                s2 = [s2, s3, s4];
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLBRK();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAssignmentExpression();
          if (s5 === peg$FAILED) {
            s5 = peg$parseSTAR();
          }
          if (s5 === peg$FAILED) {
            s5 = null;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseRBRK();
            if (s6 !== peg$FAILED) {
              s4 = [s4, s5, s6];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 === peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseLPAR();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseParameterTypeList();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRPAR();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLBRK();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAssignmentExpression();
            if (s5 === peg$FAILED) {
              s5 = peg$parseSTAR();
            }
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRBRK();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseLPAR();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseParameterTypeList();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseRPAR();
                if (s6 !== peg$FAILED) {
                  s4 = [s4, s5, s6];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseInitializer() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c45(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseLWING();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseInitializerList();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseCOMMA();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parseRWING();
              if (s4 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c46(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseInitializerList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseInitializer();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseInitializer();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c26(s5);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseInitializer();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c26(s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c47(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrimaryExpression() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c48(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseConstant();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c49(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseStringLiteral();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c50(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseLPAR();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseExpression();
              if (s2 !== peg$FAILED) {
                s3 = peg$parseRPAR();
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c51(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }

      return s0;
    }

    function peg$parsePostfixExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parsePrimaryExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLBRK();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseExpression();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseRBRK();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c52(s1, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 === peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parseLPAR();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseArgumentExpressionList();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRPAR();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c53(s1, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseDOT();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseIdentifier();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c54(s1, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              s4 = peg$parsePTR();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseIdentifier();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c55(s1, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
              if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$parseINC();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c56(s1, s4);
                }
                s3 = s4;
                if (s3 === peg$FAILED) {
                  s3 = peg$currPos;
                  s4 = peg$parseDEC();
                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c57(s1, s4);
                  }
                  s3 = s4;
                }
              }
            }
          }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLBRK();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseExpression();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseRBRK();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c52(s1, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$currPos;
            s4 = peg$parseLPAR();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseArgumentExpressionList();
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseRPAR();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c53(s1, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              s4 = peg$parseDOT();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseIdentifier();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c54(s1, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
              if (s3 === peg$FAILED) {
                s3 = peg$currPos;
                s4 = peg$parsePTR();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseIdentifier();
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c55(s1, s5);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                  s3 = peg$currPos;
                  s4 = peg$parseINC();
                  if (s4 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c56(s1, s4);
                  }
                  s3 = s4;
                  if (s3 === peg$FAILED) {
                    s3 = peg$currPos;
                    s4 = peg$parseDEC();
                    if (s4 !== peg$FAILED) {
                      peg$savedPos = s3;
                      s4 = peg$c57(s1, s4);
                    }
                    s3 = s4;
                  }
                }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c58(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseArgumentExpressionList() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAssignmentExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAssignmentExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c59(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUnaryExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$parsePostfixExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseINC();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseUnaryExpression();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c60(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseDEC();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseUnaryExpression();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c61(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseUnaryOperator();
            if (s1 !== peg$FAILED) {
              s2 = peg$parseCastExpression();
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c62(s1, s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parseSIZEOF();
              if (s1 !== peg$FAILED) {
                s2 = peg$currPos;
                s3 = peg$parseUnaryExpression();
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c63(s3);
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$parseLPAR();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parseTypeName();
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parseRPAR();
                      if (s5 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c64(s4);
                        s2 = s3;
                      } else {
                        peg$currPos = s2;
                        s2 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                  }
                }
                if (s2 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c26(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseUnaryOperator() {
      var s0;

      s0 = peg$parseAND();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSTAR();
        if (s0 === peg$FAILED) {
          s0 = peg$parsePLUS();
          if (s0 === peg$FAILED) {
            s0 = peg$parseMINUS();
            if (s0 === peg$FAILED) {
              s0 = peg$parseTILDA();
              if (s0 === peg$FAILED) {
                s0 = peg$parseBANG();
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseCastExpression() {
      var s0, s1, s2, s3, s4;

      s0 = peg$parseUnaryExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$parseLPAR();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseTypeName();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              s2 = [s2, s3, s4];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseCastExpression();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c65(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseMultiplicativeExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseCastExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseSTAR();
        if (s4 === peg$FAILED) {
          s4 = peg$parseDIV();
          if (s4 === peg$FAILED) {
            s4 = peg$parseMOD();
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseCastExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseSTAR();
          if (s4 === peg$FAILED) {
            s4 = peg$parseDIV();
            if (s4 === peg$FAILED) {
              s4 = peg$parseMOD();
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseCastExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAdditiveExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseMultiplicativeExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsePLUS();
        if (s4 === peg$FAILED) {
          s4 = peg$parseMINUS();
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseMultiplicativeExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsePLUS();
          if (s4 === peg$FAILED) {
            s4 = peg$parseMINUS();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseMultiplicativeExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseShiftExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseAdditiveExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLEFT();
        if (s4 === peg$FAILED) {
          s4 = peg$parseRIGHT();
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAdditiveExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLEFT();
          if (s4 === peg$FAILED) {
            s4 = peg$parseRIGHT();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAdditiveExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRelationalExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseShiftExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseLE();
        if (s4 === peg$FAILED) {
          s4 = peg$parseGE();
          if (s4 === peg$FAILED) {
            s4 = peg$parseLT();
            if (s4 === peg$FAILED) {
              s4 = peg$parseGT();
            }
          }
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseShiftExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseLE();
          if (s4 === peg$FAILED) {
            s4 = peg$parseGE();
            if (s4 === peg$FAILED) {
              s4 = peg$parseLT();
              if (s4 === peg$FAILED) {
                s4 = peg$parseGT();
              }
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseShiftExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEqualityExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseRelationalExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseEQUEQU();
        if (s4 === peg$FAILED) {
          s4 = peg$parseBANGEQU();
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseRelationalExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseEQUEQU();
          if (s4 === peg$FAILED) {
            s4 = peg$parseBANGEQU();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseRelationalExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseANDExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseEqualityExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseAND();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseEqualityExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseAND();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseEqualityExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseExclusiveORExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseANDExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseHAT();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseANDExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseHAT();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseANDExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseInclusiveORExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseExclusiveORExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseOR();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseExclusiveORExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseOR();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseExclusiveORExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLogicalANDExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseInclusiveORExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseANDAND();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseInclusiveORExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseANDAND();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseInclusiveORExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLogicalORExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseLogicalANDExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseOROR();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseLogicalANDExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseOROR();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseLogicalANDExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseConditionalExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseLogicalORExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseQUERY();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseExpression();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseCOLON();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseLogicalORExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseQUERY();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseExpression();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseCOLON();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseLogicalORExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c67(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAssignmentExpression() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseUnaryExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseAssignmentOperator();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAssignmentExpression();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c68(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseConditionalExpression();
      }

      return s0;
    }

    function peg$parseAssignmentOperator() {
      var s0;

      s0 = peg$parseEQU();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSTAREQU();
        if (s0 === peg$FAILED) {
          s0 = peg$parseDIVEQU();
          if (s0 === peg$FAILED) {
            s0 = peg$parseMODEQU();
            if (s0 === peg$FAILED) {
              s0 = peg$parsePLUSEQU();
              if (s0 === peg$FAILED) {
                s0 = peg$parseMINUSEQU();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseLEFTEQU();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseRIGHTEQU();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseANDEQU();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseHATEQU();
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseOREQU();
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseAssignmentExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseCOMMA();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAssignmentExpression();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseCOMMA();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAssignmentExpression();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c66(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSpacing() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseWhiteSpace();
      if (s2 === peg$FAILED) {
        s2 = peg$parseLongComment();
        if (s2 === peg$FAILED) {
          s2 = peg$parseLineComment();
        }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseWhiteSpace();
        if (s2 === peg$FAILED) {
          s2 = peg$parseLongComment();
          if (s2 === peg$FAILED) {
            s2 = peg$parseLineComment();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c69(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseWhiteSpace() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c70.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c71); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLongComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c72) {
        s1 = peg$c72;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c73); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c74) {
          s5 = peg$c74;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c75); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c74) {
            s5 = peg$c74;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c75); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c74) {
            s3 = peg$c74;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c75); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c76(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c77) {
        s1 = peg$c77;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c78); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 10) {
          s5 = peg$c79;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c80); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 10) {
            s5 = peg$c79;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c80); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c76(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAUTO() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c81) {
        s1 = peg$c81;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c82); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBREAK() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c83) {
        s1 = peg$c83;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c84); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCASE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c85) {
        s1 = peg$c85;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c86); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCHAR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c87) {
        s1 = peg$c87;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c88); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCONST() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c89) {
        s1 = peg$c89;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCONTINUE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c91) {
        s1 = peg$c91;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c92); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDEFAULT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c93) {
        s1 = peg$c93;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDOUBLE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c95) {
        s1 = peg$c95;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c96); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDO() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c97) {
        s1 = peg$c97;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseELSE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c99) {
        s1 = peg$c99;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c100); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseENUM() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c101) {
        s1 = peg$c101;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEXTERN() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c103) {
        s1 = peg$c103;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c104); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFLOAT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c105) {
        s1 = peg$c105;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c106); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFOR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c107) {
        s1 = peg$c107;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c108); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGOTO() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c109) {
        s1 = peg$c109;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c111) {
        s1 = peg$c111;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c112); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseINT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c113) {
        s1 = peg$c113;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c114); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseINLINE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c115) {
        s1 = peg$c115;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c116); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLONG() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c117) {
        s1 = peg$c117;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c118); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseREGISTER() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c119) {
        s1 = peg$c119;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c120); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRESTRICT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c121) {
        s1 = peg$c121;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c122); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRETURN() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c123) {
        s1 = peg$c123;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c124); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSHORT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c125) {
        s1 = peg$c125;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c126); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSIGNED() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c127) {
        s1 = peg$c127;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c128); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSIZEOF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c129) {
        s1 = peg$c129;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c130); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTATIC() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c131) {
        s1 = peg$c131;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c132); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTRUCT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c133) {
        s1 = peg$c133;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c134); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSWITCH() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c135) {
        s1 = peg$c135;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c136); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTYPEDEF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c137) {
        s1 = peg$c137;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c138); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUNION() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c139) {
        s1 = peg$c139;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c140); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUNSIGNED() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c141) {
        s1 = peg$c141;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c142); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseVOID() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c143) {
        s1 = peg$c143;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c144); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseVOLATILE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c145) {
        s1 = peg$c145;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c146); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWHILE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c147) {
        s1 = peg$c147;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c148); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBOOL() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c149) {
        s1 = peg$c149;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c150); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCOMPLEX() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c151) {
        s1 = peg$c151;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c152); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTDCALL() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c153) {
        s1 = peg$c153;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c154); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDECLSPEC() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 10) === peg$c155) {
        s1 = peg$c155;
        peg$currPos += 10;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c156); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseATTRIBUTE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c157) {
        s1 = peg$c157;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c158); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseNAMESPACE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 9) === peg$c159) {
        s1 = peg$c159;
        peg$currPos += 9;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c160); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUSING() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c161) {
        s1 = peg$c161;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c162); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTRUE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c163) {
        s1 = peg$c163;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c164); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFALSE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c165) {
        s1 = peg$c165;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c166); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKeyword() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c81) {
        s1 = peg$c81;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c82); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c83) {
          s1 = peg$c83;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c84); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c85) {
            s1 = peg$c85;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c86); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c87) {
              s1 = peg$c87;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c88); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 5) === peg$c89) {
                s1 = peg$c89;
                peg$currPos += 5;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c90); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 8) === peg$c91) {
                  s1 = peg$c91;
                  peg$currPos += 8;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c92); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 7) === peg$c93) {
                    s1 = peg$c93;
                    peg$currPos += 7;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c94); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6) === peg$c95) {
                      s1 = peg$c95;
                      peg$currPos += 6;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c96); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c97) {
                        s1 = peg$c97;
                        peg$currPos += 2;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c98); }
                      }
                      if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c99) {
                          s1 = peg$c99;
                          peg$currPos += 4;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c100); }
                        }
                        if (s1 === peg$FAILED) {
                          if (input.substr(peg$currPos, 4) === peg$c101) {
                            s1 = peg$c101;
                            peg$currPos += 4;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c102); }
                          }
                          if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c103) {
                              s1 = peg$c103;
                              peg$currPos += 6;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c104); }
                            }
                            if (s1 === peg$FAILED) {
                              if (input.substr(peg$currPos, 5) === peg$c105) {
                                s1 = peg$c105;
                                peg$currPos += 5;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c106); }
                              }
                              if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c107) {
                                  s1 = peg$c107;
                                  peg$currPos += 3;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c108); }
                                }
                                if (s1 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 4) === peg$c109) {
                                    s1 = peg$c109;
                                    peg$currPos += 4;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c110); }
                                  }
                                  if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c111) {
                                      s1 = peg$c111;
                                      peg$currPos += 2;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c112); }
                                    }
                                    if (s1 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 3) === peg$c113) {
                                        s1 = peg$c113;
                                        peg$currPos += 3;
                                      } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c114); }
                                      }
                                      if (s1 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 6) === peg$c115) {
                                          s1 = peg$c115;
                                          peg$currPos += 6;
                                        } else {
                                          s1 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c116); }
                                        }
                                        if (s1 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 4) === peg$c117) {
                                            s1 = peg$c117;
                                            peg$currPos += 4;
                                          } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c118); }
                                          }
                                          if (s1 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 8) === peg$c119) {
                                              s1 = peg$c119;
                                              peg$currPos += 8;
                                            } else {
                                              s1 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c120); }
                                            }
                                            if (s1 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 8) === peg$c121) {
                                                s1 = peg$c121;
                                                peg$currPos += 8;
                                              } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c122); }
                                              }
                                              if (s1 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 6) === peg$c123) {
                                                  s1 = peg$c123;
                                                  peg$currPos += 6;
                                                } else {
                                                  s1 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c124); }
                                                }
                                                if (s1 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 5) === peg$c125) {
                                                    s1 = peg$c125;
                                                    peg$currPos += 5;
                                                  } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c126); }
                                                  }
                                                  if (s1 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 6) === peg$c127) {
                                                      s1 = peg$c127;
                                                      peg$currPos += 6;
                                                    } else {
                                                      s1 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c128); }
                                                    }
                                                    if (s1 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 6) === peg$c129) {
                                                        s1 = peg$c129;
                                                        peg$currPos += 6;
                                                      } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c130); }
                                                      }
                                                      if (s1 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 6) === peg$c131) {
                                                          s1 = peg$c131;
                                                          peg$currPos += 6;
                                                        } else {
                                                          s1 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c132); }
                                                        }
                                                        if (s1 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 6) === peg$c133) {
                                                            s1 = peg$c133;
                                                            peg$currPos += 6;
                                                          } else {
                                                            s1 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c134); }
                                                          }
                                                          if (s1 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 6) === peg$c135) {
                                                              s1 = peg$c135;
                                                              peg$currPos += 6;
                                                            } else {
                                                              s1 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c136); }
                                                            }
                                                            if (s1 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 7) === peg$c137) {
                                                                s1 = peg$c137;
                                                                peg$currPos += 7;
                                                              } else {
                                                                s1 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c138); }
                                                              }
                                                              if (s1 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 5) === peg$c139) {
                                                                  s1 = peg$c139;
                                                                  peg$currPos += 5;
                                                                } else {
                                                                  s1 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c140); }
                                                                }
                                                                if (s1 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 8) === peg$c141) {
                                                                    s1 = peg$c141;
                                                                    peg$currPos += 8;
                                                                  } else {
                                                                    s1 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c142); }
                                                                  }
                                                                  if (s1 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 4) === peg$c143) {
                                                                      s1 = peg$c143;
                                                                      peg$currPos += 4;
                                                                    } else {
                                                                      s1 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c144); }
                                                                    }
                                                                    if (s1 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 8) === peg$c145) {
                                                                        s1 = peg$c145;
                                                                        peg$currPos += 8;
                                                                      } else {
                                                                        s1 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c146); }
                                                                      }
                                                                      if (s1 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 5) === peg$c147) {
                                                                          s1 = peg$c147;
                                                                          peg$currPos += 5;
                                                                        } else {
                                                                          s1 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c148); }
                                                                        }
                                                                        if (s1 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 5) === peg$c149) {
                                                                            s1 = peg$c149;
                                                                            peg$currPos += 5;
                                                                          } else {
                                                                            s1 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c150); }
                                                                          }
                                                                          if (s1 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 8) === peg$c151) {
                                                                              s1 = peg$c151;
                                                                              peg$currPos += 8;
                                                                            } else {
                                                                              s1 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c152); }
                                                                            }
                                                                            if (s1 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 10) === peg$c167) {
                                                                                s1 = peg$c167;
                                                                                peg$currPos += 10;
                                                                              } else {
                                                                                s1 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c168); }
                                                                              }
                                                                              if (s1 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 8) === peg$c153) {
                                                                                  s1 = peg$c153;
                                                                                  peg$currPos += 8;
                                                                                } else {
                                                                                  s1 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c154); }
                                                                                }
                                                                                if (s1 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 10) === peg$c155) {
                                                                                    s1 = peg$c155;
                                                                                    peg$currPos += 10;
                                                                                  } else {
                                                                                    s1 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c156); }
                                                                                  }
                                                                                  if (s1 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 13) === peg$c157) {
                                                                                      s1 = peg$c157;
                                                                                      peg$currPos += 13;
                                                                                    } else {
                                                                                      s1 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c158); }
                                                                                    }
                                                                                    if (s1 === peg$FAILED) {
                                                                                      if (input.substr(peg$currPos, 9) === peg$c159) {
                                                                                        s1 = peg$c159;
                                                                                        peg$currPos += 9;
                                                                                      } else {
                                                                                        s1 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c160); }
                                                                                      }
                                                                                      if (s1 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 5) === peg$c161) {
                                                                                          s1 = peg$c161;
                                                                                          peg$currPos += 5;
                                                                                        } else {
                                                                                          s1 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c162); }
                                                                                        }
                                                                                        if (s1 === peg$FAILED) {
                                                                                          if (input.substr(peg$currPos, 4) === peg$c163) {
                                                                                            s1 = peg$c163;
                                                                                            peg$currPos += 4;
                                                                                          } else {
                                                                                            s1 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c164); }
                                                                                          }
                                                                                          if (s1 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 5) === peg$c165) {
                                                                                              s1 = peg$c165;
                                                                                              peg$currPos += 5;
                                                                                            } else {
                                                                                              s1 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c166); }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseScopedIdentifier() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseSCOPEOP();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseIdentifier();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSCOPEOP();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s3;
            s4 = peg$c26(s4);
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseIdentifier();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSCOPEOP();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c26(s4);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c169(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIdentifier() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseKeyword();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdNondigit();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseIdChar();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseIdChar();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSpacing();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c170(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIdNondigit() {
      var s0;

      if (peg$c171.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c172); }
      }
      if (s0 === peg$FAILED) {
        if (peg$c173.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c174); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c175.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c176); }
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseUniversalCharacter();
          }
        }
      }

      return s0;
    }

    function peg$parseIdChar() {
      var s0;

      if (peg$c171.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c172); }
      }
      if (s0 === peg$FAILED) {
        if (peg$c173.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c174); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c177.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c178); }
          }
          if (s0 === peg$FAILED) {
            if (peg$c175.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c176); }
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseUniversalCharacter();
            }
          }
        }
      }

      return s0;
    }

    function peg$parseUniversalCharacter() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c179) {
        s1 = peg$c179;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c180); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseHexQuad();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c181) {
          s1 = peg$c181;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c182); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseHexQuad();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseHexQuad();
            if (s3 !== peg$FAILED) {
              s1 = [s1, s2, s3];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseHexQuad() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseHexDigit();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseHexDigit();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseHexDigit();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseHexDigit();
            if (s4 !== peg$FAILED) {
              s1 = [s1, s2, s3, s4];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseConstant() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseFloatConstant();
      if (s1 === peg$FAILED) {
        s1 = peg$parseIntegerConstant();
        if (s1 === peg$FAILED) {
          s1 = peg$parseEnumerationConstant();
          if (s1 === peg$FAILED) {
            s1 = peg$parseCharacterConstant();
            if (s1 === peg$FAILED) {
              s1 = peg$parseBooleanConstant();
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseBooleanConstant() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseTRUE();
      if (s1 === peg$FAILED) {
        s1 = peg$parseFALSE();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c183(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseIntegerConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseBinaryConstant();
      if (s1 === peg$FAILED) {
        s1 = peg$parseDecimalConstant();
        if (s1 === peg$FAILED) {
          s1 = peg$parseHexConstant();
          if (s1 === peg$FAILED) {
            s1 = peg$parseOctalConstant();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIntegerSuffix();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDecimalConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c184.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c185); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c177.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c178); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c177.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c178); }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c186(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseOctalConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c187;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c188); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c189.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c190); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c189.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c190); }
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c191(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHexConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseHexPrefix();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseHexDigit();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseHexDigit();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c192(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHexPrefix() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c193) {
        s0 = peg$c193;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c194); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c195) {
          s0 = peg$c195;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c196); }
        }
      }

      return s0;
    }

    function peg$parseHexDigit() {
      var s0;

      if (peg$c197.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c198); }
      }
      if (s0 === peg$FAILED) {
        if (peg$c199.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c200); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c177.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c178); }
          }
        }
      }

      return s0;
    }

    function peg$parseBinaryPrefix() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c201) {
        s0 = peg$c201;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c202); }
      }

      return s0;
    }

    function peg$parseBinaryDigit() {
      var s0;

      if (peg$c203.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c204); }
      }

      return s0;
    }

    function peg$parseBinaryConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseBinaryPrefix();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseBinaryDigit();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseBinaryDigit();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c205(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIntegerSuffix() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c206.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c207); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLsuffix();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseLsuffix();
        if (s1 !== peg$FAILED) {
          if (peg$c206.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c207); }
          }
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseLsuffix() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c208) {
        s0 = peg$c208;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c209); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c210) {
          s0 = peg$c210;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c211); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c212.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c213); }
          }
        }
      }

      return s0;
    }

    function peg$parseFloatConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseDecimalFloatConstant();
      if (s1 === peg$FAILED) {
        s1 = peg$parseHexFloatConstant();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseFloatSuffix();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c214(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDecimalFloatConstant() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseFraction();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseExponent();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c215(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c177.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c178); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c177.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c178); }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseExponent();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c216(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseHexFloatConstant() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseHexPrefix();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseHexFraction();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseBinaryExponent();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c217(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseHexPrefix();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseHexDigit();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseHexDigit();
            }
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseBinaryExponent();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c218(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseFraction() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c177.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c178); }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c177.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c178); }
        }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c219;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c220); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c177.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c178); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c177.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c178); }
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c221(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c177.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c178); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c177.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c178); }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s2 = peg$c219;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c220); }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c76(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseHexFraction() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseHexDigit();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseHexDigit();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c219;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c220); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseHexDigit();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseHexDigit();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c221(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseHexDigit();
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parseHexDigit();
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s2 = peg$c219;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c220); }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c222(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseExponent() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (peg$c223.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c224); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c225.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c226); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c177.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c178); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c177.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c178); }
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c227(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBinaryExponent() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (peg$c228.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c229); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c225.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c226); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c177.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c178); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c177.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c178); }
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c230(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFloatSuffix() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c231.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c232); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseEnumerationConstant() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseIdentifier();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c233(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseCharacterConstant() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 76) {
        s1 = peg$c234;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c235); }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s2 = peg$c236;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c237); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseChar();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseChar();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 39) {
              s4 = peg$c236;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c237); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseSpacing();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c238(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseEscape();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (peg$c239.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c240); }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseEscape() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseSimpleEscape();
      if (s1 === peg$FAILED) {
        s1 = peg$parseOctalEscape();
        if (s1 === peg$FAILED) {
          s1 = peg$parseHexEscape();
          if (s1 === peg$FAILED) {
            s1 = peg$parseUniversalCharacter();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSimpleEscape() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c241;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c242); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c243.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c244); }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c245(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseOctalEscape() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c241;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c242); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c189.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c190); }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c189.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c190); }
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (peg$c189.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c190); }
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c246(s1, s2, s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHexEscape() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c247) {
        s1 = peg$c247;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c248); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseHexDigit();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseHexDigit();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c249(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseStringLiteral() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 76) {
        s1 = peg$c234;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c235); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c250) {
          s1 = peg$c250;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c251); }
        }
        if (s1 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 117) {
            s1 = peg$c252;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c253); }
          }
          if (s1 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 85) {
              s1 = peg$c254;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c255); }
            }
          }
        }
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRawStringLiteral();
        if (s2 === peg$FAILED) {
          s2 = peg$parseEscapedStringLiteral();
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c256(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRawStringLiteral() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 82) {
        s1 = peg$c257;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c258); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        if (peg$c259.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c260); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parseRawStringChar();
          while (s6 !== peg$FAILED) {
            s5.push(s6);
            s6 = peg$parseRawStringChar();
          }
          if (s5 !== peg$FAILED) {
            if (peg$c259.test(input.charAt(peg$currPos))) {
              s6 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c260); }
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseSpacing();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c76(s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            if (peg$c259.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c260); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseRawStringChar();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseRawStringChar();
              }
              if (s5 !== peg$FAILED) {
                if (peg$c259.test(input.charAt(peg$currPos))) {
                  s6 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c260); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseSpacing();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s3;
                    s4 = peg$c76(s5);
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c261(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEscapedStringLiteral() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      if (peg$c259.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c260); }
      }
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parseStringChar();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parseStringChar();
        }
        if (s4 !== peg$FAILED) {
          if (peg$c259.test(input.charAt(peg$currPos))) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c260); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseSpacing();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s2;
              s3 = peg$c76(s4);
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          if (peg$c259.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c260); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseStringChar();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseStringChar();
            }
            if (s4 !== peg$FAILED) {
              if (peg$c259.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c260); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseSpacing();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c76(s4);
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$FAILED;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c261(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseRawStringChar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (peg$c262.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c263); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseStringChar() {
      var s0, s1, s2;

      s0 = peg$parseEscape();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (peg$c264.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c265); }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = void 0;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseLBRK() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c266;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c267); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRBRK() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 93) {
        s1 = peg$c268;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c269); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLPAR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c270;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c271); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRPAR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 41) {
        s1 = peg$c272;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c273); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLWING() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c274;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c275); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRWING() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 125) {
        s1 = peg$c276;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c277); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDOT() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c219;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c220); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePTR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c278) {
        s1 = peg$c278;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c279); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseINC() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c280) {
        s1 = peg$c280;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c281); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDEC() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c282) {
        s1 = peg$c282;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c283); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAND() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 38) {
        s1 = peg$c284;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c285); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c286.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c287); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTAR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 42) {
        s1 = peg$c288;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c289); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePLUS() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c292;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c293); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c294.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c295); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseMINUS() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c296;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c297); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c298.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c299); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTILDA() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 126) {
        s1 = peg$c300;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c301); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBANG() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 33) {
        s1 = peg$c302;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c303); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDIV() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 47) {
        s1 = peg$c304;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c305); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseMOD() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 37) {
        s1 = peg$c306;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c307); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c308.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c309); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLEFT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c310) {
        s1 = peg$c310;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c311); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRIGHT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c312) {
        s1 = peg$c312;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c313); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 60) {
        s1 = peg$c314;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c315); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 62) {
        s1 = peg$c316;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c317); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c318) {
        s1 = peg$c318;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c319); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c320) {
        s1 = peg$c320;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c321); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEQUEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c322) {
        s1 = peg$c322;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c323); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBANGEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c324) {
        s1 = peg$c324;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c325); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHAT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 94) {
        s1 = peg$c326;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c327); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseOR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 124) {
        s1 = peg$c328;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c329); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c290.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c291); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseANDAND() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c330) {
        s1 = peg$c330;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c331); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseOROR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c332) {
        s1 = peg$c332;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c333); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseQUERY() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 63) {
        s1 = peg$c334;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c335); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCOLON() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 58) {
        s1 = peg$c336;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c337); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c338.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c339); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSEMI() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 59) {
        s1 = peg$c340;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c341); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseELLIPSIS() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c342) {
        s1 = peg$c342;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c343); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEQU() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s1 = peg$c344;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c345); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c344;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c345); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c26(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTAREQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c346) {
        s1 = peg$c346;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c347); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDIVEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c348) {
        s1 = peg$c348;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c349); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseMODEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c350) {
        s1 = peg$c350;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c351); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePLUSEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c352) {
        s1 = peg$c352;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c353); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseMINUSEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c354) {
        s1 = peg$c354;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c355); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLEFTEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c356) {
        s1 = peg$c356;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c357); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRIGHTEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c358) {
        s1 = peg$c358;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c359); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseANDEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c360) {
        s1 = peg$c360;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c361); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseHATEQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c362) {
        s1 = peg$c362;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c363); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseOREQU() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c364) {
        s1 = peg$c364;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c365); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCOMMA() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s1 = peg$c366;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c367); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSCOPEOP() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c368) {
        s1 = peg$c368;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c369); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c26(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEOT() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      s1 = peg$parse_();
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = void 0;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c370); }
      }

      return s0;
    }


    function buildRecursiveBinop(a, b){
      var ret = a;
      for (var i=0; i<b.length; i++) {
        ret = addPositionInfo({type:'BinOpExpression', left:ret, op:b[i][0], right:b[i][1]});
      }
      return ret;
    };

    function addPositionInfo(r){
        var posDetails = peg$computePosDetails(peg$currPos);
        r.eLine = posDetails.line;
        r.eColumn = posDetails.column;
        r.eOffset = peg$currPos;
        posDetails = peg$computePosDetails(peg$savedPos);
        r.sLine = posDetails.line;
        r.sColumn = posDetails.column;
        r.sOffset = peg$savedPos;
        return r;
    }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
},{}],2:[function(require,module,exports){
var Debugger, Runtime;

Runtime = require("./rt");

Debugger = function() {
  this.src = "";
  this.prevNode = null;
  this.done = false;
  this.conditions = {
    isStatement: function(prevNode, newStmt) {
      return newStmt != null ? newStmt.type.indexOf("Statement" >= 0) : void 0;
    },
    positionChanged: function(prevNode, newStmt) {
      return (prevNode != null ? prevNode.eOffset : void 0) !== newStmt.eOffset || (prevNode != null ? prevNode.sOffset : void 0) !== newStmt.sOffset;
    },
    lineChanged: function(prevNode, newStmt) {
      return (prevNode != null ? prevNode.sLine : void 0) !== newStmt.sLine;
    }
  };
  this.stopConditions = {
    isStatement: false,
    positionChanged: false,
    lineChanged: true
  };
  return this;
};

Debugger.prototype.start = function(rt, gen) {
  this.rt = rt;
  return this.gen = gen;
};

Debugger.prototype["continue"] = function() {
  var active, curStmt, done, name, ref;
  while (true) {
    done = this.next();
    if (done !== false) {
      return done;
    }
    curStmt = this.nextNode();
    ref = this.stopConditions;
    for (name in ref) {
      active = ref[name];
      if (active) {
        if (this.conditions[name](this.prevNode, curStmt)) {
          return false;
        }
      }
    }
  }
};

Debugger.prototype.next = function() {
  var ngen;
  this.prevNode = this.nextNode();
  ngen = this.gen.next();
  if (ngen.done) {
    this.done = true;
    return ngen.value;
  } else {
    return false;
  }
};

Debugger.prototype.nextLine = function() {
  var s;
  s = this.nextNode();
  return this.src.slice(s.sOffset, s.eOffset).trim();
};

Debugger.prototype.nextNode = function() {
  if (this.done) {
    return {
      sOffset: -1,
      sLine: -1,
      sColumn: -1,
      eOffset: -1,
      eLine: -1,
      eColumn: -1
    };
  } else {
    return this.rt.interp.currentNode;
  }
};

Debugger.prototype.variable = function(name) {
  var i, ref, ref1, ret, scopeIndex, usedName, v, val;
  if (name) {
    v = this.rt.readVar(name);
    return {
      type: this.rt.makeTypeString(v.t),
      value: v.v
    };
  } else {
    usedName = new Set();
    ret = [];
    for (scopeIndex = i = ref = this.rt.scope.length - 1; i >= 0; scopeIndex = i += -1) {
      ref1 = this.rt.scope[scopeIndex];
      for (name in ref1) {
        val = ref1[name];
        if (typeof val === "object" && "t" in val && "v" in val) {
          if (!usedName.has(name)) {
            usedName.add(name);
            ret.push({
              name: name,
              type: this.rt.makeTypeString(val.t),
              value: this.rt.makeValueString(val)
            });
          }
        }
      }
    }
    return ret;
  }
};

module.exports = Debugger;

},{"./rt":17}],3:[function(require,module,exports){
var slice = [].slice;

module.exports = function() {
  var defaultOpHandler, defaults;
  defaults = this;
  this.config = {
    specifiers: ["const", "inline", "_stdcall", "extern", "static", "auto", "register"],
    charTypes: ["char", "signed char", "unsigned char", "wchar_t", "unsigned wchar_t", "char16_t", "unsigned char16_t", "char32_t", "unsigned char32_t"],
    intTypes: ["short", "short int", "signed short", "signed short int", "unsigned short", "unsigned short int", "int", "signed int", "unsigned", "unsigned int", "long", "long int", "long int", "signed long", "signed long int", "unsigned long", "unsigned long int", "long long", "long long int", "long long int", "signed long long", "signed long long int", "unsigned long long", "unsigned long long int", "bool"],
    limits: {
      "char": {
        max: 0x7f,
        min: 0x00,
        bytes: 1
      },
      "signed char": {
        max: 0x7f,
        min: -0x80,
        bytes: 1
      },
      "unsigned char": {
        max: 0xff,
        min: 0x00,
        bytes: 1
      },
      "wchar_t": {
        max: 0x7fffffff,
        min: -0x80000000,
        bytes: 4
      },
      "unsigned wchar_t": {
        max: 0xffffffff,
        min: 0x00000000,
        bytes: 4
      },
      "char16_t": {
        max: 0x7fff,
        min: -0x8000,
        bytes: 4
      },
      "unsigned char16_t": {
        max: 0xffff,
        min: 0x0000,
        bytes: 4
      },
      "char32_t": {
        max: 0x7fffffff,
        min: -0x80000000,
        bytes: 4
      },
      "unsigned char32_t": {
        max: 0xffffffff,
        min: 0x00000000,
        bytes: 4
      },
      "short": {
        max: 0x7fff,
        min: -0x8000,
        bytes: 2
      },
      "unsigned short": {
        max: 0xffff,
        min: 0x0000,
        bytes: 2
      },
      "int": {
        max: 0x7fffffff,
        min: -0x80000000,
        bytes: 4
      },
      "unsigned": {
        max: 0xffffffff,
        min: 0x00000000,
        bytes: 4
      },
      "long": {
        max: 0x7fffffff,
        min: -0x80000000,
        bytes: 4
      },
      "unsigned long": {
        max: 0xffffffff,
        min: 0x00000000,
        bytes: 4
      },
      "long long": {
        max: 0x7fffffffffffffff,
        min: -0x8000000000000000,
        bytes: 8
      },
      "unsigned long long": {
        max: 0xffffffffffffffff,
        min: 0x0000000000000000,
        bytes: 8
      },
      "float": {
        max: 3.40282346638529e+038,
        min: -3.40282346638529e+038,
        bytes: 4
      },
      "double": {
        max: 1.79769313486232e+308,
        min: -1.79769313486232e+308,
        bytes: 8
      },
      "pointer": {
        max: void 0,
        min: void 0,
        bytes: 4
      },
      "bool": {
        max: 1,
        min: 0,
        bytes: 1
      }
    },
    loadedLibraries: []
  };
  this.config.limits["short int"] = this.config.limits["short"];
  this.config.limits["signed short"] = this.config.limits["short"];
  this.config.limits["signed short int"] = this.config.limits["short"];
  this.config.limits["unsigned short int"] = this.config.limits["unsigned short"];
  this.config.limits["signed int"] = this.config.limits["int"];
  this.config.limits["unsigned int"] = this.config.limits["unsigned"];
  this.config.limits["long int"] = this.config.limits["long"];
  this.config.limits["long int"] = this.config.limits["long"];
  this.config.limits["signed long"] = this.config.limits["long"];
  this.config.limits["signed long int"] = this.config.limits["long"];
  this.config.limits["unsigned long int"] = this.config.limits["unsigned long"];
  this.config.limits["long long int"] = this.config.limits["long long"];
  this.config.limits["long long int"] = this.config.limits["long long"];
  this.config.limits["signed long long"] = this.config.limits["long long"];
  this.config.limits["signed long long int"] = this.config.limits["long long"];
  this.config.limits["unsigned long long int"] = this.config.limits["unsigned long long"];
  this.numericTypeOrder = ["char", "signed char", "short", "short int", "signed short", "signed short int", "int", "signed int", "long", "long int", "long int", "signed long", "signed long int", "long long", "long long int", "long long int", "signed long long", "signed long long int", "float", "double"];
  defaultOpHandler = {
    "o(*)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support * on " + rt.makeTypeString(r.t));
        }
        ret = l.v * r.v;
        rett = rt.promoteNumeric(l.t, r.t);
        return rt.val(rett, ret);
      }
    },
    "o(/)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support / on " + rt.makeTypeString(r.t));
        }
        ret = l.v / r.v;
        if (rt.isIntegerType(l.t) && rt.isIntegerType(r.t)) {
          ret = Math.floor(ret);
        }
        rett = rt.promoteNumeric(l.t, r.t);
        return rt.val(rett, ret);
      }
    },
    "o(%)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support % on " + rt.makeTypeString(r.t));
        }
        ret = l.v % r.v;
        rett = rt.promoteNumeric(l.t, r.t);
        return rt.val(rett, ret);
      }
    },
    "o(+)": {
      "#default": function(rt, l, r) {
        var i, ret, rett;
        if (r === void 0) {
          return l;
        } else {
          if (!rt.isNumericType(r.t)) {
            rt.raiseException(rt.makeTypeString(l.t) + " does not support + on " + rt.makeTypeString(r.t));
          }
          if (rt.isArrayType(r.t)) {
            i = rt.cast(rt.intTypeLiteral, l).v;
            return rt.val(r.t, rt.makeArrayPointerValue(r.v.target, r.v.position + i));
          } else {
            ret = l.v + r.v;
            rett = rt.promoteNumeric(l.t, r.t);
            return rt.val(rett, ret);
          }
        }
      }
    },
    "o(-)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (r === void 0) {
          rett = l.v > 0 ? rt.getSignedType(l.t) : l.t;
          return rt.val(rett, -l.v);
        } else {
          if (!rt.isNumericType(r.t)) {
            rt.raiseException(rt.makeTypeString(l.t) + " does not support - on " + rt.makeTypeString(r.t));
          }
          ret = l.v - r.v;
          rett = rt.promoteNumeric(l.t, r.t);
          return rt.val(rett, ret);
        }
      }
    },
    "o(<<)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support << on " + rt.makeTypeString(r.t));
        }
        ret = l.v << r.v;
        rett = l.t;
        return rt.val(rett, ret);
      }
    },
    "o(>>)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support >> on " + rt.makeTypeString(r.t));
        }
        ret = l.v >> r.v;
        rett = l.t;
        return rt.val(rett, ret);
      }
    },
    "o(<)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support < on " + rt.makeTypeString(r.t));
        }
        ret = l.v < r.v;
        rett = rt.boolTypeLiteral;
        return rt.val(rett, ret);
      }
    },
    "o(<=)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support <= on " + rt.makeTypeString(r.t));
        }
        ret = l.v <= r.v;
        rett = rt.boolTypeLiteral;
        return rt.val(rett, ret);
      }
    },
    "o(>)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support > on " + rt.makeTypeString(r.t));
        }
        ret = l.v > r.v;
        rett = rt.boolTypeLiteral;
        return rt.val(rett, ret);
      }
    },
    "o(>=)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support >= on " + rt.makeTypeString(r.t));
        }
        ret = l.v >= r.v;
        rett = rt.boolTypeLiteral;
        return rt.val(rett, ret);
      }
    },
    "o(==)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support == on " + rt.makeTypeString(r.t));
        }
        ret = l.v === r.v;
        rett = rt.boolTypeLiteral;
        return rt.val(rett, ret);
      }
    },
    "o(!=)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support != on " + rt.makeTypeString(r.t));
        }
        ret = l.v !== r.v;
        rett = rt.boolTypeLiteral;
        return rt.val(rett, ret);
      }
    },
    "o(&)": {
      "#default": function(rt, l, r) {
        var ret, rett, t;
        if (r === void 0) {
          if (l.array) {
            return rt.val(rt.arrayPointerType(l.t, l.array.length), rt.makeArrayPointerValue(l.array, l.arrayIndex));
          } else {
            t = rt.normalPointerType(l.t);
            return rt.val(t, rt.makeNormalPointerValue(l));
          }
        } else {
          if (!rt.isIntegerType(l.t) || !rt.isNumericType(r.t) || !rt.isIntegerType(r.t)) {
            rt.raiseException(rt.makeTypeString(l.t) + " does not support & on " + rt.makeTypeString(r.t));
          }
          ret = l.v & r.v;
          rett = rt.promoteNumeric(l.t, r.t);
          return rt.val(rett, ret);
        }
      }
    },
    "o(^)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support ^ on " + rt.makeTypeString(r.t));
        }
        ret = l.v ^ r.v;
        rett = rt.promoteNumeric(l.t, r.t);
        return rt.val(rett, ret);
      }
    },
    "o(|)": {
      "#default": function(rt, l, r) {
        var ret, rett;
        if (!rt.isNumericType(r.t) || !rt.isIntegerType(l.t) || !rt.isIntegerType(r.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support | on " + rt.makeTypeString(r.t));
        }
        ret = l.v | r.v;
        rett = rt.promoteNumeric(l.t, r.t);
        return rt.val(rett, ret);
      }
    },
    "o(,)": {
      "#default": function(rt, l, r) {
        return r;
      }
    },
    "o(=)": {
      "#default": function(rt, l, r) {
        if (l.left) {
          l.v = rt.cast(l.t, r).v;
          return l;
        } else {
          rt.raiseException(rt.makeValString(l) + " is not a left value");
        }
      }
    },
    "o(+=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(+)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(-=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(-)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(*=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(*)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(/=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(/)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(%=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(%)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(<<=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(<<)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(>>=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(>>)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(&=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(&)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(^=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(^)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(|=)": {
      "#default": function(rt, l, r) {
        r = defaultOpHandler["o(|)"]["#default"](rt, l, r);
        return defaultOpHandler["o(=)"]["#default"](rt, l, r);
      }
    },
    "o(++)": {
      "#default": function(rt, l, dummy) {
        var b;
        if (!rt.isNumericType(l.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support increment");
        }
        if (!l.left) {
          rt.raiseException(rt.makeValString(l) + " is not a left value");
        }
        if (dummy) {
          b = l.v;
          l.v = l.v + 1;
          if (rt.inrange(l.t, l.v)) {
            return rt.val(l.t, b);
          }
          rt.raiseException("overflow during post-increment " + (rt.makeValString(l)));
        } else {
          l.v = l.v + 1;
          if (rt.inrange(l.t, l.v)) {
            return l;
          }
          rt.raiseException("overflow during pre-increment " + (rt.makeValString(l)));
        }
      }
    },
    "o(--)": {
      "#default": function(rt, l, dummy) {
        var b;
        if (!rt.isNumericType(l.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support decrement");
        }
        if (!l.left) {
          rt.raiseException(rt.makeValString(l) + " is not a left value");
        }
        if (dummy) {
          b = l.v;
          l.v = l.v - 1;
          if (rt.inrange(l.t, l.v)) {
            return rt.val(l.t, b);
          }
          rt.raiseException("overflow during post-decrement");
        } else {
          l.v = l.v - 1;
          b = l.v;
          if (rt.inrange(l.t, l.v)) {
            return l;
          }
          rt.raiseException("overflow during pre-decrement");
        }
      }
    },
    "o(~)": {
      "#default": function(rt, l, dummy) {
        var ret, rett;
        if (!rt.isIntegerType(l.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support ~ on itself");
        }
        ret = ~l.v;
        rett = rt.promoteNumeric(l.t, rt.intTypeLiteral);
        return rt.val(rett, ret);
      }
    },
    "o(!)": {
      "#default": function(rt, l, dummy) {
        var ret, rett;
        if (!rt.isIntegerType(l.t)) {
          rt.raiseException(rt.makeTypeString(l.t) + " does not support ! on itself");
        }
        ret = l.v ? 0 : 1;
        rett = l.t;
        return rt.val(rett, ret);
      }
    }
  };
  this.types = {
    "global": {}
  };
  this.types["(char)"] = defaultOpHandler;
  this.types["(signed char)"] = defaultOpHandler;
  this.types["(unsigned char)"] = defaultOpHandler;
  this.types["(short)"] = defaultOpHandler;
  this.types["(short int)"] = defaultOpHandler;
  this.types["(signed short)"] = defaultOpHandler;
  this.types["(signed short int)"] = defaultOpHandler;
  this.types["(unsigned short)"] = defaultOpHandler;
  this.types["(unsigned short int)"] = defaultOpHandler;
  this.types["(int)"] = defaultOpHandler;
  this.types["(signed int)"] = defaultOpHandler;
  this.types["(unsigned)"] = defaultOpHandler;
  this.types["(unsigned int)"] = defaultOpHandler;
  this.types["(long)"] = defaultOpHandler;
  this.types["(long int)"] = defaultOpHandler;
  this.types["(long int)"] = defaultOpHandler;
  this.types["(signed long)"] = defaultOpHandler;
  this.types["(signed long int)"] = defaultOpHandler;
  this.types["(unsigned long)"] = defaultOpHandler;
  this.types["(unsigned long int)"] = defaultOpHandler;
  this.types["(long long)"] = defaultOpHandler;
  this.types["(long long int)"] = defaultOpHandler;
  this.types["(long long int)"] = defaultOpHandler;
  this.types["(signed long long)"] = defaultOpHandler;
  this.types["(signed long long int)"] = defaultOpHandler;
  this.types["(unsigned long long)"] = defaultOpHandler;
  this.types["(unsigned long long int)"] = defaultOpHandler;
  this.types["(float)"] = defaultOpHandler;
  this.types["(double)"] = defaultOpHandler;
  this.types["(bool)"] = defaultOpHandler;
  this.types["pointer"] = {
    "o(==)": {
      "#default": function(rt, l, r) {
        if (rt.isTypeEqualTo(l.t, r.t)) {
          if (l.t.ptrType === "array") {
            return l.v.target === r.v.target && (l.v.target === null || l.v.position === r.v.position);
          } else {
            return l.v.target === r.v.target;
          }
        }
        return false;
      }
    },
    "o(!=)": {
      "#default": function(rt, l, r) {
        return !rt.types["pointer"]["=="]["#default"](rt, l, r);
      }
    },
    "o(,)": {
      "#default": function(rt, l, r) {
        return r;
      }
    },
    "o(=)": {
      "#default": function(rt, l, r) {
        var t;
        if (!l.left) {
          rt.raiseException(rt.makeValString(l) + " is not a left value");
        }
        t = rt.cast(l.t, r);
        l.t = t.t;
        l.v = t.v;
        return l;
      }
    },
    "o(&)": {
      "#default": function(rt, l, r) {
        var t;
        if (r === void 0) {
          if (l.array) {
            return rt.val(rt.arrayPointerType(l.t, l.array.length), rt.makeArrayPointerValue(l.array, l.arrayIndex));
          } else {
            t = rt.normalPointerType(l.t);
            return rt.val(t, rt.makeNormalPointerValue(l));
          }
        } else {
          rt.raiseException("you cannot cast bitwise and on pointer");
        }
      }
    },
    "o(())": {
      "#default": function(rt, l, bindThis, args) {
        if (!rt.isFunctionType(l.v.target)) {
          rt.raiseException("pointer target(" + (rt.makeValueString(l.v.target)) + ") is not a function");
        }
        return rt.types["function"]["o(())"]["default"](rt, l.v.target, bindThis, args);
      }
    }
  };
  this.types["function"] = {
    "o(())": {
      "#default": function(rt, l, bindThis, args) {
        if (l.t.type === "pointer" && l.t.targetType.type === "function") {
          l = l.v.target;
        }
        if (l.v.target === null) {
          rt.raiseException("function " + l.v.name + " does not seem to be implemented");
        }
        return rt.getCompatibleFunc(l.v.defineType, l.v.name, args).apply(null, [rt, bindThis].concat(slice.call(args)));
      }
    },
    "o(&)": {
      "#default": function(rt, l, r) {
        var t;
        if (r === void 0) {
          t = rt.normalPointerType(l.t);
          return rt.val(t, rt.makeNormalPointerValue(l));
        } else {
          rt.raiseException("you cannot cast bitwise and on function");
        }
      }
    }
  };
  this.types["pointer_normal"] = {
    "o(*)": {
      "#default": function(rt, l, r) {
        if (r === void 0) {
          return l.v.target;
        } else {
          rt.raiseException("you cannot multiply a pointer");
        }
      }
    },
    "o(->)": {
      "#default": function(rt, l, r) {
        return rt.getMember(l.v.target, r);
      }
    }
  };
  this.types["pointer_array"] = {
    "o(*)": {
      "#default": function(rt, l, r) {
        var arr, ret;
        if (r === void 0) {
          arr = l.v.target;
          if (l.v.position >= arr.length) {
            rt.raiseException("index out of bound " + l.v.position + " >= " + arr.length);
          } else if (l.v.position < 0) {
            rt.raiseException("negative index " + l.v.position);
          }
          ret = arr[l.v.position];
          ret.array = arr;
          ret.arrayIndex = l.v.position;
          return ret;
        } else {
          rt.raiseException("you cannot multiply a pointer");
        }
      }
    },
    "o([])": {
      "#default": function(rt, l, r) {
        r = rt.types["pointer_array"]["o(+)"]["#default"](rt, l, r);
        return rt.types["pointer_array"]["o(*)"]["#default"](rt, r);
      }
    },
    "o(->)": {
      "#default": function(rt, l, r) {
        l = rt.types["pointer_array"]["o(*)"]["#default"](rt, l);
        return rt.getMember(l, r);
      }
    },
    "o(-)": {
      "#default": function(rt, l, r) {
        var i;
        if (rt.isNumericType(r.t)) {
          i = rt.cast(rt.intTypeLiteral, r).v;
          return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position - i));
        } else if (rt.isArrayType(r.t)) {
          if (l.v.target === r.v.target) {
            return l.v.position - r.v.position;
          } else {
            rt.raiseException("you cannot perform minus on pointers pointing to different arrays");
          }
        } else {
          rt.raiseException(rt.makeTypeString(r.t) + " is not an array pointer type");
        }
      }
    },
    "o(<)": {
      "#default": function(rt, l, r) {
        if (rt.isArrayType(r.t)) {
          if (l.v.target === r.v.target) {
            return l.v.position < r.v.position;
          } else {
            rt.raiseException("you cannot perform compare on pointers pointing to different arrays");
          }
        } else {
          rt.raiseException(rt.makeTypeString(r.t) + " is not an array pointer type");
        }
      }
    },
    "o(>)": {
      "#default": function(rt, l, r) {
        if (rt.isArrayType(r.t)) {
          if (l.v.target === r.v.target) {
            return l.v.position > r.v.position;
          } else {
            rt.raiseException("you cannot perform compare on pointers pointing to different arrays");
          }
        } else {
          rt.raiseException(rt.makeTypeString(r.t) + " is not an array pointer type");
        }
      }
    },
    "o(<=)": {
      "#default": function(rt, l, r) {
        if (rt.isArrayType(r.t)) {
          if (l.v.target === r.v.target) {
            return l.v.position <= r.v.position;
          } else {
            rt.raiseException("you cannot perform compare on pointers pointing to different arrays");
          }
        } else {
          rt.raiseException(rt.makeTypeString(r.t) + " is not an array pointer type");
        }
      }
    },
    "o(>=)": {
      "#default": function(rt, l, r) {
        if (rt.isArrayType(r.t)) {
          if (l.v.target === r.v.target) {
            return l.v.position >= r.v.position;
          } else {
            rt.raiseException("you cannot perform compare on pointers pointing to different arrays");
          }
        } else {
          rt.raiseException(rt.makeTypeString(r.t) + " is not an array pointer type");
        }
      }
    },
    "o(+)": {
      "#default": function(rt, l, r) {
        var i;
        if (rt.isNumericType(r.t)) {
          i = rt.cast(rt.intTypeLiteral, r).v;
          return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position + i));
        } else {
          rt.raiseException("cannot add non-numeric to a pointer");
        }
      }
    },
    "o(+=)": {
      "#default": function(rt, l, r) {
        r = rt.types["pointer_array"]["o(+)"]["#default"](rt, l, r);
        return rt.types["pointer"]["="]["#default"](rt, l, r);
      }
    },
    "o(-=)": {
      "#default": function(rt, l, r) {
        r = rt.types["pointer_array"]["o(-)"]["#default"](rt, l, r);
        return rt.types["pointer"]["="]["#default"](rt, l, r);
      }
    },
    "o(++)": {
      "#default": function(rt, l, dummy) {
        if (!l.left) {
          rt.raiseException(rt.makeValString(l) + " is not a left value");
        }
        if (dummy) {
          return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position++));
        } else {
          l.v.position++;
          return l;
        }
      }
    },
    "o(--)": {
      "#default": function(rt, l, dummy) {
        if (!l.left) {
          rt.raiseException(rt.makeValString(l) + " is not a left value");
        }
        if (dummy) {
          return rt.val(l.t, rt.makeArrayPointerValue(l.v.target, l.v.position--));
        } else {
          l.v.position--;
          return l;
        }
      }
    }
  };
  return this;
};

},{}],4:[function(require,module,exports){
module.exports = {
  load: function(rt) {
    rt.regFunc((function(rt, _this, x) {
      var c;
      c = rt.getFunc("global", "isdigit", [rt.intTypeLiteral])(rt, _this, x);
      if (!c.v) {
        return rt.getFunc("global", "isalpha", [rt.intTypeLiteral])(rt, _this, x);
      }
      return c;
    }), "global", "isalnum", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var v;
      v = x.v >= "0".charCodeAt(0) && x.v <= "9".charCodeAt(0) ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "isdigit", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var c;
      c = rt.getFunc("global", "isupper", [rt.intTypeLiteral])(rt, _this, x);
      if (!c.v) {
        return rt.getFunc("global", "islower", [rt.intTypeLiteral])(rt, _this, x);
      }
      return c;
    }), "global", "isalpha", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var ref, v;
      v = (ref = x.v) === 0x20 || ref === 0x09 || ref === 0x0a || ref === 0x0b || ref === 0x0c || ref === 0x0d ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "isspace", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var v;
      v = x.v >= 0x00 && x.v <= 0x1f || x.v === 0x7f ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "iscntrl", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var v;
      v = x.v > 0x1f && x.v !== 0x7f ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "isprint", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var c;
      c = rt.getFunc("global", "isspace", [rt.intTypeLiteral])(rt, _this, x);
      if (!c.v) {
        c = rt.getFunc("global", "isgraph", [rt.intTypeLiteral])(rt, _this, x);
        if (!c.v) {
          return rt.val(rt.intTypeLiteral, 1);
        }
      }
      return rt.val(rt.intTypeLiteral, 0);
    }), "global", "isgraph", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var v;
      v = x.v >= "a".charCodeAt(0) && x.v <= "z".charCodeAt(0) ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "islower", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var v;
      v = x.v >= "A".charCodeAt(0) && x.v <= "Z".charCodeAt(0) ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "isupper", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var c;
      c = rt.getFunc("global", "isgraph", [rt.intTypeLiteral])(rt, _this, x);
      if (c.v) {
        c = rt.getFunc("global", "isalnum", [rt.intTypeLiteral])(rt, _this, x);
        if (!c.v) {
          return rt.val(rt.intTypeLiteral, 1);
        }
      }
      return rt.val(rt.intTypeLiteral, 0);
    }), "global", "ispunct", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var v;
      v = x.v >= "A".charCodeAt(0) && x.v <= "F".charCodeAt(0) || x.v >= "a".charCodeAt(0) && x.v <= "f".charCodeAt(0) || x.v >= "0".charCodeAt(0) && x.v <= "9".charCodeAt(0) ? 1 : 0;
      return rt.val(rt.intTypeLiteral, v);
    }), "global", "isxdigit", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var c;
      c = rt.getFunc("global", "isupper", [rt.intTypeLiteral])(rt, _this, x);
      if (c.v) {
        return rt.val(rt.intTypeLiteral, x.v + 32);
      }
      return x;
    }), "global", "tolower", [rt.intTypeLiteral], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, x) {
      var c;
      c = rt.getFunc("global", "islower", [rt.intTypeLiteral])(rt, _this, x);
      if (c.v) {
        return rt.val(rt.intTypeLiteral, x.v - 32);
      }
      return x;
    }), "global", "toupper", [rt.intTypeLiteral], rt.intTypeLiteral);
  }
};

},{}],5:[function(require,module,exports){
module.exports = {
  load: function(rt) {
    var g, tDouble;
    tDouble = rt.doubleTypeLiteral;
    g = "global";
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.cos(x.v));
    }), g, "cos", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.sin(x.v));
    }), g, "sin", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.tan(x.v));
    }), g, "tan", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.acos(x.v));
    }), g, "acos", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.asin(x.v));
    }), g, "asin", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.atan(x.v));
    }), g, "atan", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, y, x) {
      return rt.val(tDouble, Math.atan(y.v / x.v));
    }), g, "atan2", [tDouble, tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.cosh(x.v));
    }), g, "cosh", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.sinh(x.v));
    }), g, "sinh", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.tanh(x.v));
    }), g, "tanh", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.acosh(x.v));
    }), g, "acosh", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.asinh(x.v));
    }), g, "asinh", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.atanh(x.v));
    }), g, "atanh", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.exp(x.v));
    }), g, "exp", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.log(x.v));
    }), g, "log", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.log10(x.v));
    }), g, "log10", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x, y) {
      return Math.pow(x.v, y.v);
    }), g, "pow", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.sqrt(x.v));
    }), g, "sqrt", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.ceil(x.v));
    }), g, "ceil", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.floor(x.v));
    }), g, "floor", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.abs(x.v));
    }), g, "fabs", [tDouble], tDouble);
    rt.regFunc((function(rt, _this, x) {
      return rt.val(tDouble, Math.abs(x.v));
    }), g, "abs", [tDouble], tDouble);
  }
};

},{}],6:[function(require,module,exports){
var format_type_map, printf, validate_format,
  slice = [].slice;

printf = require("printf");

format_type_map = function(rt, ctrl) {
  switch (ctrl) {
    case "d":
    case "i":
      return rt.intTypeLiteral;
    case "u":
    case "o":
    case "x":
    case "X":
      return rt.unsignedintTypeLiteral;
    case "f":
    case "F":
      return rt.floatTypeLiteral;
    case "e":
    case "E":
    case "g":
    case "G":
    case "a":
    case "A":
      return rt.doubleTypeLiteral;
    case "c":
      return rt.charTypeLiteral;
    case "s":
      return rt.normalPointerType(rt.charTypeLiteral);
    case "p":
      return rt.normalPointerType(rt.voidTypeLiteral);
    case "n":
      return rt.raiseException("%n is not supported");
  }
};

validate_format = function() {
  var casted, ctrl, format, i, params, results, target, type, val;
  format = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  i = 0;
  results = [];
  while ((ctrl = /(?:(?!%).)%([diuoxXfFeEgGaAcspn])/.exec(format)) != null) {
    type = format_type_map(ctrl[1]);
    if (params.length <= i) {
      rt.raiseException("insufficient arguments (at least " + (i + 1) + " is required)");
    }
    target = params[i++];
    casted = rt.cast(type, target);
    if (rt.isStringType(casted.t)) {
      results.push(val = rt.getStringFromCharArray(casted));
    } else {
      results.push(val = casted.v);
    }
  }
  return results;
};

module.exports = {
  load: function(rt) {
    var __printf, _printf, _sprintf, pchar, stdio;
    rt.include("cstring");
    pchar = rt.normalPointerType(rt.charTypeLiteral);
    stdio = rt.config.stdio;
    __printf = function() {
      var format, params, parsed_params, retval;
      format = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      if (rt.isStringType(format.t)) {
        format = format.v.target;
        parsed_params = validate_format.apply(null, [format].concat(slice.call(params)));
        retval = printf.apply(null, [format].concat(slice.call(parsed_params)));
        return rt.makeCharArrayFromString(retval);
      } else {
        return rt.raiseException("format must be a string");
      }
    };
    _sprintf = function() {
      var _this, format, params, retval, rt, target;
      rt = arguments[0], _this = arguments[1], target = arguments[2], format = arguments[3], params = 5 <= arguments.length ? slice.call(arguments, 4) : [];
      retval = __printf.apply(null, [format].concat(slice.call(params)));
      rt.getFunc("global", "strcpy", [pchar, pchar])(rt, null, [target, retval]);
      return rt.val(rt.intTypeLiteral, retval.length);
    };
    rt.regFunc(_sprintf, "global", "sprintf", [pchar, pchar, "?"], rt.intTypeLiteral);
    _printf = function() {
      var _this, format, params, retval, rt;
      rt = arguments[0], _this = arguments[1], format = arguments[2], params = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      retval = __printf.apply(null, [format].concat(slice.call(params)));
      stdio.write(retval);
      return rt.val(rt.intTypeLiteral, retval.length);
    };
    return rt.regFunc(_printf, "global", "printf", [pchar, "?"], rt.intTypeLiteral);
  }
};

},{"printf":45}],7:[function(require,module,exports){
module.exports = {
  load: function(rt) {
    var _abs, _atof, _atoi, _atol, _bsearch, _div, _labs, _ldiv, _qsort, _rand, _srand, _system, binary_search, cmpType, div_t_t, ldiv_t_t, m_w, m_z, mask, pchar, random, seed;
    m_w = 123456789;
    m_z = 987654321;
    mask = 0xffffffff;
    seed = function(i) {
      return m_w = i;
    };
    random = function() {
      var result;
      m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
      result = ((m_z << 16) + m_w) & mask;
      return result / 4294967296 + 0.5;
    };
    pchar = rt.normalPointerType(rt.charTypeLiteral);
    _atof = function(rt, _this, str) {
      var val;
      if (rt.isStringType(str.t)) {
        str = rt.getStringFromCharArray(str);
        val = Number.parseFloat(str);
        return rt.val(rt.floatTypeLiteral, val);
      } else {
        return rt.raiseException("argument is not a string");
      }
    };
    rt.regFunc(_atof, "global", "atof", [pchar], rt.floatTypeLiteral);
    _atoi = function(rt, _this, str) {
      var val;
      if (rt.isStringType(str.t)) {
        str = rt.getStringFromCharArray(str);
        val = Number.parseInt(str);
        return rt.val(rt.intTypeLiteral, val);
      } else {
        return rt.raiseException("argument is not a string");
      }
    };
    rt.regFunc(_atoi, "global", "atoi", [pchar], rt.intTypeLiteral);
    _atol = function(rt, _this, str) {
      var val;
      if (rt.isStringType(str.t)) {
        str = rt.getStringFromCharArray(str);
        val = Number.parseInt(str);
        return rt.val(rt.longTypeLiteral, val);
      } else {
        return rt.raiseException("argument is not a string");
      }
    };
    rt.regFunc(_atol, "global", "atol", [pchar], rt.longTypeLiteral);
    if (rt.scope[0]["RAND_MAX"] == null) {
      rt.scope[0]["RAND_MAX"] = 0x7fffffff;
    }
    _rand = function(rt, _this) {
      var val;
      val = Math.floor(random() * (rt.scope[0]["RAND_MAX"] + 1));
      return rt.val(rt.intTypeLiteral, val);
    };
    rt.regFunc(_rand, "global", "rand", [], rt.intTypeLiteral);
    _srand = function(rt, _this, i) {
      return seed(i.v);
    };
    rt.regFunc(_srand, "global", "srand", [rt.unsignedintTypeLiteral], rt.voidTypeLiteral);
    _system = function(rt, _this, command) {
      var e, error, ret, str;
      if (command === rt.nullPointer) {
        return rt.val(rt.intTypeLiteral, 1);
      } else if (rt.isStringType(command.t)) {
        str = rt.getStringFromCharArray(str);
        try {
          ret = eval(str);
          if (ret != null) {
            console.log(ret);
          }
          return rt.val(rt.intTypeLiteral, 1);
        } catch (error) {
          e = error;
          return rt.val(rt.intTypeLiteral, 0);
        }
      } else {
        return rt.raiseException("command is not a string");
      }
    };
    rt.regFunc(_system, "global", "system", [pchar], rt.intTypeLiteral);
    rt.scope[0]["NULL"] = rt.nullPointer;
    binary_search = function(val, L, cmp) {
      var cmpResult, mid;
      if (L.length === 0) {
        return false;
      }
      mid = Math.floor(L.length / 2);
      cmpResult = cmp(val, L[mid], mid);
      if (cmpResult === 0) {
        return mid;
      } else if (cmpResult > 0) {
        return binary_search(val, L.slice(mid + 1, +L.length + 1 || 9e9));
      } else {
        return binary_search(val, L.slice(0, +(mid - 1) + 1 || 9e9));
      }
    };
    _bsearch = function(rt, _this, key, base, num, size, cmp) {
      var L, bsRet, val, wrapper;
      if (rt.isArrayType(base)) {
        L = base.v.target;
        val = key;
        wrapper = function(a, b, indexB) {
          var pbType, pbVal, pointerB;
          pbType = base.t;
          pbVal = rt.makeArrayPointerValue(L, indexB);
          pointerB = rt.val(pbType, pbVal);
          return cmp(rt, null, a, pointerB).v;
        };
        bsRet = binary_search(val, L, wrapper);
        if (bsRet === false) {
          return rt.nullPointer;
        } else {
          return rt.val(base.t, rt.makeArrayPointerValue(L, bsRet));
        }
      } else {
        return rt.raiseException("base must be an array");
      }
    };
    cmpType = rt.functionPointerType(rt.intTypeLiteral, [rt.voidPointerType, rt.voidPointerType]);
    rt.regFunc(_bsearch, "global", "bsearch", [rt.voidPointerType, rt.voidPointerType, rt.intTypeLiteral, rt.intTypeLiteral, cmpType], rt.voidPointerType);
    _qsort = function(rt, _this, base, num, size, cmp) {
      var L, ele, i, j, len, wrapper;
      if (rt.isArrayType(base)) {
        L = base.v.target;
        for (i = j = 0, len = L.length; j < len; i = ++j) {
          ele = L[i];
          ele.index = i;
        }
        wrapper = function(a, b) {
          var pType, paVal, pbVal, pointerA, pointerB;
          pType = base.t;
          pbVal = rt.makeArrayPointerValue(L, b.index);
          paVal = rt.makeArrayPointerValue(L, a.index);
          pointerB = rt.val(pType, pbVal);
          pointerA = rt.val(pType, pbVal);
          return cmp(rt, null, pointerA, pointerB).v;
        };
        L.sort(wrapper);
      } else {
        return rt.raiseException("base must be an array");
      }
    };
    rt.regFunc(_qsort, "global", "qsort", [rt.voidPointerType, rt.intTypeLiteral, rt.intTypeLiteral, cmpType], rt.voidTypeLiteral);
    _abs = function(rt, _this, n) {
      return rt.val(rt.intTypeLiteral, Math.abs(n.v));
    };
    rt.regFunc(_abs, "global", "abs", [rt.intTypeLiteral], rt.intTypeLiteral);
    _div = function(rt, _this, numer, denom) {
      var quot, rem;
      if (denom.v === 0) {
        rt.raiseException("divided by zero");
      }
      quot = rt.val(rt.intTypeLiteral, Math.floor(numer.v / denom.v));
      rem = rt.val(rt.intTypeLiteral, numer.v % denom.v);
      return {
        t: div_t_t,
        v: {
          members: {
            quot: quot,
            rem: rem
          }
        }
      };
    };
    div_t_t = rt.newClass("div_t", [
      {
        type: rt.intTypeLiteral,
        name: "quot"
      }, {
        type: rt.intTypeLiteral,
        name: "rem"
      }
    ]);
    rt.regFunc(_div, "global", "div", [rt.intTypeLiteral, rt.intTypeLiteral], div_t_t);
    _labs = function(rt, _this, n) {
      return rt.val(rt.longTypeLiteral, Math.abs(n.v));
    };
    rt.regFunc(_labs, "global", "labs", [rt.longTypeLiteral], rt.longTypeLiteral);
    _ldiv = function(rt, _this, numer, denom) {
      var quot, rem;
      if (denom.v === 0) {
        rt.raiseException("divided by zero");
      }
      quot = rt.val(rt.longTypeLiteral, Math.floor(numer.v / denom.v));
      rem = rt.val(rt.longTypeLiteral, numer.v % denom.v);
      return {
        t: ldiv_t_t,
        v: {
          members: {
            quot: quot,
            rem: rem
          }
        }
      };
    };
    ldiv_t_t = rt.newClass("ldiv_t", [
      {
        type: rt.longTypeLiteral,
        name: "quot"
      }, {
        type: rt.longTypeLiteral,
        name: "rem"
      }
    ]);
    return rt.regFunc(_ldiv, "global", "ldiv", [rt.longTypeLiteral, rt.longTypeLiteral], ldiv_t_t);
  }
};

},{}],8:[function(require,module,exports){
module.exports = {
  load: function(rt) {
    var pchar, sizet;
    pchar = rt.normalPointerType(rt.charTypeLiteral);
    sizet = rt.primitiveType("unsigned int");
    rt.regFunc((function(rt, _this, dest, src) {
      var destarr, i, j, srcarr;
      if (rt.isArrayType(dest.t) && rt.isArrayType(src.t)) {
        srcarr = src.v.target;
        i = src.v.position;
        destarr = dest.v.target;
        j = dest.v.position;
        while (i < srcarr.length && j < destarr.length && srcarr[i].v !== 0) {
          destarr[j] = rt.clone(srcarr[i]);
          i++;
          j++;
        }
        if (i === srcarr.length) {
          rt.raiseException("source string does not have a pending \"\\0\"");
        } else if (j === destarr.length - 1) {
          rt.raiseException("destination array is not big enough");
        } else {
          destarr[j] = rt.val(rt.charTypeLiteral, 0);
        }
      } else {
        rt.raiseException("destination or source is not an array");
      }
      return dest;
    }), "global", "strcpy", [pchar, pchar], pchar);
    rt.regFunc((function(rt, _this, dest, src, num) {
      var destarr, i, j, srcarr;
      if (rt.isArrayType(dest.t) && rt.isArrayType(src.t)) {
        srcarr = src.v.target;
        i = src.v.position;
        destarr = dest.v.target;
        j = dest.v.position;
        while (num > 0 && i < srcarr.length && j < destarr.length - 1 && srcarr[i].v !== 0) {
          destarr[j] = rt.clone(srcarr[i]);
          num--;
          i++;
          j++;
        }
        if (srcarr[i].v === 0) {
          while (num > 0 && j < destarr.length) {
            destarr[j++] = rt.val(rt.charTypeLiteral, 0);
          }
        }
        if (i === srcarr.length) {
          rt.raiseException("source string does not have a pending \"\\0\"");
        } else if (j === destarr.length - 1) {
          rt.raiseException("destination array is not big enough");
        }
      } else {
        rt.raiseException("destination or source is not an array");
      }
      return dest;
    }), "global", "strncpy", [pchar, pchar, sizet], pchar);
    rt.regFunc((function(rt, _this, dest, src) {
      var destarr, i, j, lendest, lensrc, newDest, srcarr;
      if (rt.isArrayType(dest.t) && rt.isArrayType(src.t)) {
        srcarr = src.v.target;
        destarr = dest.v.target;
        if (srcarr === destarr) {
          i = src.v.position;
          j = dest.v.position;
          if (i < j) {
            lensrc = rt.getFunc("global", "strlen", [pchar])(rt, null, [src]).v;
            if (i + lensrc + 1 >= j) {
              rt.raiseException("overlap is not allowed");
            }
          } else {
            lensrc = rt.getFunc("global", "strlen", [pchar])(rt, null, [src]).v;
            lendest = rt.getFunc("global", "strlen", [pchar])(rt, null, [dest]).v;
            if (j + lensrc + lendest + 1 >= i) {
              rt.raiseException("overlap is not allowed");
            }
          }
        }
        lendest = rt.getFunc("global", "strlen", [pchar])(rt, null, [dest]).v;
        newDest = rt.val(pchar, rt.makeArrayPointerValue(dest.v.target, dest.v.position + lendest));
        return rt.getFunc("global", "strcpy", [pchar, pchar])(rt, null, [newDest, src]);
      } else {
        rt.raiseException("destination or source is not an array");
      }
      return dest;
    }), "global", "strcat", [pchar, pchar], pchar);
    rt.regFunc((function(rt, _this, dest, src, num) {
      var destarr, i, j, lendest, lensrc, newDest, srcarr;
      if (rt.isArrayType(dest.t) && rt.isArrayType(src.t)) {
        srcarr = src.v.target;
        destarr = dest.v.target;
        if (srcarr === destarr) {
          i = src.v.position;
          j = dest.v.position;
          if (i < j) {
            lensrc = rt.getFunc("global", "strlen", [pchar])(rt, null, [src]).v;
            if (lensrc > num) {
              lensrc = num;
            }
            if (i + lensrc + 1 >= j) {
              rt.raiseException("overlap is not allowed");
            }
          } else {
            lensrc = rt.getFunc("global", "strlen", [pchar])(rt, null, [src]).v;
            if (lensrc > num) {
              lensrc = num;
            }
            lendest = rt.getFunc("global", "strlen", [pchar])(rt, null, [dest]).v;
            if (j + lensrc + lendest + 1 >= i) {
              rt.raiseException("overlap is not allowed");
            }
          }
        }
        lendest = rt.getFunc("global", "strlen", [pchar])(rt, null, [dest]).v;
        newDest = rt.val(pchar, rt.makeArrayPointerValue(dest.v.target, dest.v.position + lendest));
        return rt.getFunc("global", "strncpy", [pchar, pchar, sizet])(rt, null, [newDest, src, num]);
      } else {
        rt.raiseException("destination or source is not an array");
      }
      return dest;
    }), "global", "strncat", [pchar, pchar, sizet], pchar);
    rt.regFunc((function(rt, _this, str) {
      var arr, i;
      if (rt.isArrayType(str.t)) {
        arr = str.v.target;
        i = str.v.position;
        while (i < arr.length && arr[i].v !== 0) {
          i++;
        }
        if (i === arr.length) {
          return rt.raiseException("target string does not have a pending \"\\0\"");
        } else {
          return rt.val(rt.intTypeLiteral, i - str.v.position);
        }
      } else {
        return rt.raiseException("target is not an array");
      }
    }), "global", "strlen", [pchar], sizet);
    rt.regFunc((function(rt, _this, dest, src) {
      var destarr, i, j, srcarr;
      if (rt.isArrayType(dest.t) && rt.isArrayType(src.t)) {
        srcarr = src.v.target;
        i = src.v.position;
        destarr = dest.v.target;
        j = dest.v.position;
        while (i < srcarr.length && j < destarr.length && srcarr[i].v === destarr[i].v) {
          i++;
          j++;
        }
        return rt.val(rt.intTypeLiteral, destarr[i].v - srcarr[i].v);
      } else {
        return rt.raiseException("str1 or str2 is not an array");
      }
    }), "global", "strcmp", [pchar, pchar], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, dest, src, num) {
      var destarr, i, j, srcarr;
      if (rt.isArrayType(dest.t) && rt.isArrayType(src.t)) {
        srcarr = src.v.target;
        i = src.v.position;
        destarr = dest.v.target;
        j = dest.v.position;
        while (num > 0 && i < srcarr.length && j < destarr.length && srcarr[i].v === destarr[i].v) {
          i++;
          j++;
          num--;
        }
        return rt.val(rt.intTypeLiteral, destarr[i].v - srcarr[i].v);
      } else {
        return rt.raiseException("str1 or str2 is not an array");
      }
    }), "global", "strncmp", [pchar, pchar, sizet], rt.intTypeLiteral);
    rt.regFunc((function(rt, _this, str, ch) {
      var arr, i;
      if (rt.isArrayType(str.t)) {
        arr = str.v.target;
        i = str.v.position;
        while (i < arr.length && arr[i].v !== 0 && arr[i].v !== ch.v) {
          i++;
        }
        if (arr[i].v === 0) {
          return rt.val(pchar, rt.nullPointerValue);
        } else if (arr[i].v === ch.v) {
          return rt.val(pchar, rt.makeArrayPointerValue(arr, i));
        } else {
          return rt.raiseException("target string does not have a pending \"\\0\"");
        }
      } else {
        return rt.raiseException("str1 or str2 is not an array");
      }
    }), "global", "strchr", [pchar, rt.charTypeLiteral], pchar);
    rt.regFunc((function(rt, _this, str, ch) {
      var arr, i, lastpos;
      if (rt.isArrayType(str.t)) {
        arr = str.v.target;
        i = str.v.position;
        lastpos = -1;
        while (i < arr.length && arr[i].v !== 0) {
          if (arr[i].v === ch.v) {
            lastpos = i;
          }
          i++;
        }
        if (arr[i].v === 0) {
          if (lastpos >= 0) {
            return rt.val(pchar, rt.makeArrayPointerValue(arr, lastpos));
          } else {
            return rt.val(pchar, rt.nullPointerValue);
          }
        } else {
          return rt.raiseException("target string does not have a pending \"\\0\"");
        }
      } else {
        return rt.raiseException("str1 or str2 is not an array");
      }
    }), "global", "strrchr", [pchar, rt.charTypeLiteral], pchar);
    return rt.regFunc((function(rt, _this, str1, str2) {
      var _i, arr, i, j, tar;
      if (rt.isArrayType(str1.t) && rt.isArrayType(str2.t)) {
        arr = str1.v.target;
        i = str1.v.position;
        tar = str2.v.target;
        while (i < arr.length && arr[i].v !== 0) {
          j = str2.v.position;
          _i = i;
          while (j < tar.length && str1[_i].v === str2[j]) {
            _i++;
            j++;
          }
          if (j === tar.length) {
            break;
          }
          i++;
        }
        if (arr[i].v === 0) {
          return rt.val(pchar, rt.nullPointerValue);
        } else if (i === arr.length) {
          return rt.raiseException("target string does not have a pending \"\\0\"");
        } else {
          return rt.val(pchar, rt.makeArrayPointerValue(arr, i));
        }
      } else {
        return rt.raiseException("str1 or str2 is not an array");
      }
    }), "global", "strstr", [pchar, rt.charTypeLiteral], pchar);
  }
};

},{}],9:[function(require,module,exports){
module.exports = {
  load: function(rt) {
    var _addManipulator, _fixed, _setfill, _setprecesion, _setw, oType, type;
    type = rt.newClass("iomanipulator", []);
    oType = rt.simpleType("ostream", []);
    _setprecesion = function(rt, _this, x) {
      return {
        t: type,
        v: {
          members: {
            name: "setprecision",
            f: function(config) {
              return config.setprecision = x.v;
            }
          }
        },
        left: false
      };
    };
    rt.regFunc(_setprecesion, "global", "setprecision", [rt.intTypeLiteral], type);
    _fixed = {
      t: type,
      v: {
        members: {
          name: "fixed",
          f: function(config) {
            return config.fixed = true;
          }
        }
      }
    };
    rt.scope[0]["fixed"] = _fixed;
    _setw = function(rt, _this, x) {
      return {
        t: type,
        v: {
          members: {
            name: "setw",
            f: function(config) {
              return config.setw = x.v;
            }
          }
        }
      };
    };
    rt.regFunc(_setw, "global", "setw", [rt.intTypeLiteral], type);
    _setfill = function(rt, _this, x) {
      return {
        t: type,
        v: {
          members: {
            name: "setfill",
            f: function(config) {
              return config.setfill = String.fromCharCode(x.v);
            }
          }
        }
      };
    };
    rt.regFunc(_setfill, "global", "setfill", [rt.charTypeLiteral], type);
    _addManipulator = function(rt, _cout, m) {
      _cout.manipulators || (_cout.manipulators = {
        config: {},
        active: {},
        use: function(o) {
          var fill, i, j, prec, ref, tarStr;
          if (rt.isNumericType(o.t) && !rt.isIntegerType(o.t)) {
            if (this.active.fixed) {
              prec = this.active.setprecision != null ? this.config.setprecision : 6;
              tarStr = o.v.toFixed(prec);
            } else if (this.active.setprecision != null) {
              tarStr = o.v.toPrecision(this.config.setprecision).replace(/0+$/, "");
            }
          }
          if (this.active.setw != null) {
            if (this.active.setfill != null) {
              fill = this.config.setfill;
            } else {
              fill = " ";
            }
            if (!(rt.isTypeEqualTo(o.t, rt.charTypeLiteral) && (o.v === 10 || o.v === 13))) {
              tarStr || (tarStr = rt.isPrimitiveType(o.t) ? o.t.name.indexOf("char") >= 0 ? String.fromCharCode(o.v) : o.t.name === "bool" ? o.v ? "1" : "0" : o.v.toString() : rt.isStringType(o.t) ? rt.getStringFromCharArray(o) : rt.raiseException("<< operator in ostream cannot accept " + rt.makeTypeString(o.t)));
              for (i = j = 0, ref = this.config.setw - tarStr.length; j < ref; i = j += 1) {
                tarStr = fill + tarStr;
              }
              delete this.active.setw;
            }
          }
          if (tarStr != null) {
            return rt.makeCharArrayFromString(tarStr);
          } else {
            return o;
          }
        }
      });
      m.v.members.f(_cout.manipulators.config);
      _cout.manipulators.active[m.v.members.name] = m.v.members.f;
      return _cout;
    };
    rt.regOperator(_addManipulator, oType, "<<", [type], oType);
  }
};

},{}],10:[function(require,module,exports){
var _read, _skipSpace;

_skipSpace = function(s) {
  var r;
  r = /^\s*/.exec(s);
  if (r && r.length > 0) {
    return s.substring(r[0].length);
  } else {
    return s;
  }
};

_read = function(rt, reg, buf, type) {
  var r;
  r = reg.exec(buf);
  if ((r == null) || r.length === 0) {
    return rt.raiseException("input format mismatch " + rt.makeTypeString(type) + " with buffer=" + buf);
  } else {
    return r;
  }
};

module.exports = {
  load: function(rt) {
    var _bool, _cinString, _get, _getline, cin, cout, endl, pchar, stdio, type;
    stdio = rt.config.stdio;
    type = rt.newClass("istream", []);
    cin = {
      t: type,
      v: {
        buf: stdio.drain(),
        istream: stdio,
        members: {}
      },
      left: false
    };
    rt.scope[0]["cin"] = cin;
    pchar = rt.normalPointerType(rt.charTypeLiteral);
    rt.types[rt.getTypeSignature(type)] = {
      "#father": "object",
      "o(>>)": {
        "#default": function(rt, _cin, t) {
          var b, len, r, v;
          if (!t.left) {
            rt.raiseException("only left value can be used as storage");
          }
          if (!rt.isPrimitiveType(t.t)) {
            rt.raiseException(">> operator in istream cannot accept " + rt.makeTypeString(t.t));
          }
          b = _cin.v.buf;
          _cin.v.eofbit = b.length === 0;
          switch (t.t.name) {
            case "char":
            case "signed char":
            case "unsigned char":
              b = _skipSpace(b);
              r = _read(rt, /^./, b, t.t);
              v = r[0].charCodeAt(0);
              break;
            case "short":
            case "short int":
            case "signed short":
            case "signed short int":
            case "unsigned short":
            case "unsigned short int":
            case "int":
            case "signed int":
            case "unsigned":
            case "unsigned int":
            case "long":
            case "long int":
            case "long int":
            case "signed long":
            case "signed long int":
            case "unsigned long":
            case "unsigned long int":
            case "long long":
            case "long long int":
            case "long long int":
            case "signed long long":
            case "signed long long int":
            case "unsigned long long":
            case "unsigned long long int":
              b = _skipSpace(b);
              r = _read(rt, /^[-+]?(?:([0-9]*)([eE]\+?[0-9]+)?)|0/, b, t.t);
              v = parseInt(r[0]);
              break;
            case "float":
            case "double":
              b = _skipSpace(b);
              r = _read(rt, /^[-+]?(?:[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?)|(?:([1-9][0-9]*)([eE]\+?[0-9]+)?)/, b, t.t);
              v = parseFloat(r[0]);
              break;
            case "bool":
              b = _skipSpace(b);
              r = _read(rt, /^(true|false)/, b, t.t);
              v = r[0] === "true";
              break;
            default:
              rt.raiseException(">> operator in istream cannot accept " + rt.makeTypeString(t.t));
          }
          len = r[0].length;
          _cin.v.failbit = len === 0;
          if (!_cin.v.failbit) {
            t.v = rt.val(t.t, v).v;
            _cin.v.buf = b.substring(len);
          }
          return _cin;
        }
      }
    };
    _cinString = function(rt, _cin, t) {
      var b, i, initialPos, j, r, ref, tar;
      if (!rt.isStringType(t.t)) {
        rt.raiseException("only a pointer to string can be used as storage");
      }
      b = _cin.v.buf;
      _cin.v.eofbit = b.length === 0;
      b = _skipSpace(b);
      r = _read(rt, /^\S*/, b, t.t)[0];
      _cin.v.failbit = r.length === 0;
      _cin.v.buf = b.substring(r.length);
      initialPos = t.v.position;
      tar = t.v.target;
      if (tar.length - initialPos <= r.length) {
        rt.raiseException("target string buffer is " + (r.length - (tar.length - initialPos)) + " too short");
      }
      for (i = j = 0, ref = r.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        tar[i + initialPos] = rt.val(rt.charTypeLiteral, r.charCodeAt(i));
      }
      tar[r.length + initialPos] = rt.val(rt.charTypeLiteral, 0);
      return _cin;
    };
    rt.regOperator(_cinString, cin.t, ">>", [pchar], cin.t);
    _getline = function(rt, _cin, t, limit, delim) {
      var b, i, initialPos, j, r, ref, removeDelim, tar;
      if (!rt.isStringType(t.t)) {
        rt.raiseException("only a pointer to string can be used as storage");
      }
      limit = limit.v;
      delim = delim != null ? delim.v : '\n';
      b = _cin.v.buf;
      _cin.v.eofbit = b.length === 0;
      r = _read(rt, new RegExp("^[^" + delim + "]*"), b, t.t)[0];
      if (r.length + 1 > limit) {
        r = r.substring(0, limit - 1);
      }
      if (b.charAt(r.length) === delim.charAt(0)) {
        removeDelim = true;
        _cin.v.failbit = false;
      } else {
        _cin.v.failbit = r.length === 0;
      }
      _cin.v.buf = b.substring(r.length + (removeDelim ? 1 : 0));
      initialPos = t.v.position;
      tar = t.v.target;
      if (tar.length - initialPos <= r.length) {
        rt.raiseException("target string buffer is " + (r.length - (tar.length - initialPos)) + " too short");
      }
      for (i = j = 0, ref = r.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        tar[i + initialPos] = rt.val(rt.charTypeLiteral, r.charCodeAt(i));
      }
      tar[r.length + initialPos] = rt.val(rt.charTypeLiteral, 0);
      return _cin;
    };
    rt.regFunc(_getline, cin.t, "getline", [pchar, rt.intTypeLiteral, rt.charTypeLiteral], cin.t);
    rt.regFunc(_getline, cin.t, "getline", [pchar, rt.intTypeLiteral], cin.t);
    _get = function(rt, _cin) {
      var b, r, v;
      b = _cin.v.buf;
      r = _read(rt, /^.|[\r\n]/, b, rt.charTypeLiteral);
      _cin.v.buf = b.substring(r.length);
      v = r[0].charCodeAt(0);
      return rt.val(rt.charTypeLiteral, v);
    };
    rt.regFunc(_get, cin.t, "get", [], cin.t);
    _bool = function(rt, _cin) {
      return rt.val(rt.boolTypeLiteral, !_cin.v.failbit);
    };
    rt.regOperator(_bool, cin.t, "bool", [], rt.boolTypeLiteral);
    type = rt.newClass("ostream", []);
    cout = {
      t: rt.simpleType("ostream"),
      v: {
        ostream: stdio,
        members: {}
      },
      left: false
    };
    rt.scope[0]["cout"] = cout;
    rt.types[rt.getTypeSignature(cout.t)] = {
      "#father": "object",
      "o(<<)": {
        "#default": function(rt, _cout, t) {
          var r;
          if (_cout.manipulators != null) {
            t = _cout.manipulators.use(t);
          }
          if (rt.isPrimitiveType(t.t)) {
            if (t.t.name.indexOf("char") >= 0) {
              r = String.fromCharCode(t.v);
            } else if (t.t.name === "bool") {
              r = t.v ? "1" : "0";
            } else {
              r = t.v.toString();
            }
          } else if (rt.isStringType(t.t)) {
            r = rt.getStringFromCharArray(t);
          } else {
            rt.raiseException("<< operator in ostream cannot accept " + rt.makeTypeString(t.t));
          }
          _cout.v.ostream.write(r);
          return _cout;
        }
      }
    };
    endl = rt.val(rt.charTypeLiteral, "\n".charCodeAt(0));
    rt.scope[0]["endl"] = endl;
  }
};

},{}],11:[function(require,module,exports){
JSCPP = require('./main');
},{"./main":14}],12:[function(require,module,exports){
var Interpreter, isGenerator, isGeneratorFunction, sampleGenerator, sampleGeneratorFunction;

sampleGeneratorFunction = function*() {
  return (yield null);
};

sampleGenerator = sampleGeneratorFunction();

isGenerator = function(g) {
  return (g != null ? g.constructor : void 0) === sampleGenerator.constructor;
};

isGeneratorFunction = function(f) {
  return (f != null ? f.constructor : void 0) === sampleGeneratorFunction.constructor;
};

Interpreter = function(rt) {
  this.rt = rt;
  this.visitors = {
    TranslationUnit: function*(interp, s, param) {
      var dec, i;
      rt = interp.rt;
      i = 0;
      while (i < s.ExternalDeclarations.length) {
        dec = s.ExternalDeclarations[i];
        (yield* interp.visit(interp, dec));
        i++;
      }
    },
    DirectDeclarator: function*(interp, s, param) {
      var _basetype, _param, _pointer, _type, argTypes, basetype, dim, dimensions, j, k, l, len, len1, len2, m, ptl, ref, ref1, ref2, ret, right, varargs;
      rt = interp.rt;
      basetype = param.basetype;
      basetype = interp.buildRecursivePointerType(s.Pointer, basetype, 0);
      if (s.right.length === 1) {
        right = s.right[0];
        ptl = null;
        if (right.type === "DirectDeclarator_modifier_ParameterTypeList") {
          ptl = right.ParameterTypeList;
          varargs = ptl.varargs;
        } else if (right.type === "DirectDeclarator_modifier_IdentifierList" && right.IdentifierList === null) {
          ptl = right.ParameterTypeList;
          varargs = false;
        }
        if (ptl != null) {
          argTypes = [];
          ref = ptl.ParameterList;
          for (k = 0, len = ref.length; k < len; k++) {
            _param = ref[k];
            _basetype = rt.simpleType(_param.DeclarationSpecifiers);
            if (_param.Declarator != null) {
              _pointer = _param.Declarator.Pointer;
              _type = interp.buildRecursivePointerType(_pointer, _basetype, 0);
              if ((_param.Declarator.right != null) && _param.Declarator.right.length > 0) {
                dimensions = [];
                ref1 = _param.Declarator.right;
                for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
                  dim = ref1[j];
                  dim = _param.Declarator.right[j];
                  if (dim.type !== "DirectDeclarator_modifier_array") {
                    rt.raiseException("unacceptable array initialization");
                  }
                  if (dim.Expression !== null) {
                    dim = rt.cast(rt.intTypeLiteral, (yield* interp.visit(interp, dim.Expression, param))).v;
                  } else if (j > 0) {
                    rt.raiseException("multidimensional array must have bounds for all dimensions except the first");
                  } else {
                    dim = -1;
                  }
                  dimensions.push(dim);
                }
                _type = interp.arrayType(dimensions, 0, _type);
              }
            } else {
              _type = _basetype;
            }
            argTypes.push(_type);
          }
          basetype = rt.functionType(basetype, argTypes);
        }
      }
      if (s.right.length > 0 && s.right[0].type === "DirectDeclarator_modifier_array") {
        dimensions = [];
        ref2 = s.right;
        for (j = m = 0, len2 = ref2.length; m < len2; j = ++m) {
          dim = ref2[j];
          if (dim.type !== "DirectDeclarator_modifier_array") {
            rt.raiseException("unacceptable array initialization");
          }
          if (dim.type !== "DirectDeclarator_modifier_array") {
            rt.raiseException("unacceptable array initialization");
          }
          if (dim.Expression !== null) {
            dim = rt.cast(rt.intTypeLiteral, (yield* interp.visit(interp, dim.Expression, param))).v;
          } else if (j > 0) {
            rt.raiseException("multidimensional array must have bounds for all dimensions except the first");
          } else {
            dim = -1;
          }
          dimensions.push(dim);
        }
        basetype = interp.arrayType(dimensions, 0, basetype);
      }
      if (s.left.type === "Identifier") {
        return {
          type: basetype,
          name: s.left.Identifier
        };
      } else {
        _basetype = param.basetype;
        param.basetype = basetype;
        ret = (yield* interp.visit(interp, s.left, param));
        param.basetype = _basetype;
        return ret;
      }
    },
    TypedefDeclaration: function*(interp, s, param) {
      var _basetype, basetype, declarator, k, len, name, ref, ref1, type;
      rt = interp.rt;
      basetype = rt.simpleType(s.DeclarationSpecifiers);
      _basetype = param.basetype;
      param.basetype = basetype;
      ref = s.Declarators;
      for (k = 0, len = ref.length; k < len; k++) {
        declarator = ref[k];
        ref1 = (yield* interp.visit(interp, declarator, param)), type = ref1.type, name = ref1.name;
        rt.registerTypedef(type, name);
      }
      param.basetype = _basetype;
    },
    FunctionDefinition: function*(interp, s, param) {
      var _basetype, _name, _param, _pointer, _type, argNames, argTypes, basetype, dim, dimensions, i, j, name, pointer, ptl, scope, stat, varargs;
      rt = interp.rt;
      scope = param.scope;
      name = s.Declarator.left.Identifier;
      basetype = rt.simpleType(s.DeclarationSpecifiers);
      pointer = s.Declarator.Pointer;
      basetype = interp.buildRecursivePointerType(pointer, basetype, 0);
      argTypes = [];
      argNames = [];
      ptl = void 0;
      varargs = void 0;
      if (s.Declarator.right.type === "DirectDeclarator_modifier_ParameterTypeList") {
        ptl = s.Declarator.right.ParameterTypeList;
        varargs = ptl.varargs;
      } else if (s.Declarator.right.type === "DirectDeclarator_modifier_IdentifierList" && s.Declarator.right.IdentifierList === null) {
        ptl = {
          ParameterList: []
        };
        varargs = false;
      } else {
        rt.raiseException("unacceptable argument list");
      }
      i = 0;
      while (i < ptl.ParameterList.length) {
        _param = ptl.ParameterList[i];
        _pointer = _param.Declarator.Pointer;
        _basetype = rt.simpleType(_param.DeclarationSpecifiers);
        _type = interp.buildRecursivePointerType(_pointer, _basetype, 0);
        _name = _param.Declarator.left.Identifier;
        if (_param.Declarator.right.length > 0) {
          dimensions = [];
          j = 0;
          while (j < _param.Declarator.right.length) {
            dim = _param.Declarator.right[j];
            if (dim.type !== "DirectDeclarator_modifier_array") {
              rt.raiseException("unacceptable array initialization");
            }
            if (dim.Expression !== null) {
              dim = rt.cast(rt.intTypeLiteral, (yield* interp.visit(interp, dim.Expression, param))).v;
            } else if (j > 0) {
              rt.raiseException("multidimensional array must have bounds for all dimensions except the first");
            } else {
              dim = -1;
            }
            dimensions.push(dim);
            j++;
          }
          _type = interp.arrayType(dimensions, 0, _type);
        }
        argTypes.push(_type);
        argNames.push(_name);
        i++;
      }
      stat = s.CompoundStatement;
      rt.defFunc(scope, name, basetype, argTypes, argNames, stat, interp);
    },
    Declaration: function*(interp, s, param) {
      var _basetype, basetype, dec, dim, dimensions, i, init, initializer, j, k, l, len, len1, name, ref, ref1, ref2, ref3, type;
      rt = interp.rt;
      basetype = rt.simpleType(s.DeclarationSpecifiers);
      ref = s.InitDeclaratorList;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        dec = ref[i];
        init = dec.Initializers;
        if (dec.Declarator.right.length > 0 && dec.Declarator.right[0].type === "DirectDeclarator_modifier_array") {
          dimensions = [];
          ref1 = dec.Declarator.right;
          for (j = l = 0, len1 = ref1.length; l < len1; j = ++l) {
            dim = ref1[j];
            if (dim.Expression !== null) {
              dim = rt.cast(rt.intTypeLiteral, (yield* interp.visit(interp, dim.Expression, param))).v;
            } else if (j > 0) {
              rt.raiseException("multidimensional array must have bounds for all dimensions except the first");
            } else {
              if (init.type === "Initializer_expr") {
                initializer = (yield* interp.visit(interp, init, param));
                if (rt.isCharType(basetype) && rt.isArrayType(initializer.t) && rt.isCharType(initializer.t.eleType)) {
                  dim = initializer.v.target.length;
                  init = {
                    type: "Initializer_array",
                    Initializers: initializer.v.target.map(function(e) {
                      return {
                        type: "Initializer_expr",
                        shorthand: e
                      };
                    })
                  };
                } else {
                  rt.raiseException("cannot initialize an array to " + rt.makeValString(initializer));
                }
              } else {
                dim = init.Initializers.length;
              }
            }
            dimensions.push(dim);
          }
          init = (yield* interp.arrayInit(dimensions, init, 0, basetype, param));
          _basetype = param.basetype;
          param.basetype = basetype;
          ref2 = (yield* interp.visit(interp, dec.Declarator, param)), name = ref2.name, type = ref2.type;
          param.basetype = _basetype;
          rt.defVar(name, init.t, init);
        } else {
          _basetype = param.basetype;
          param.basetype = basetype;
          ref3 = (yield* interp.visit(interp, dec.Declarator, param)), name = ref3.name, type = ref3.type;
          param.basetype = _basetype;
          if (init == null) {
            init = rt.defaultValue(type, true);
          } else {
            init = (yield* interp.visit(interp, init.Expression));
          }
          rt.defVar(name, type, init);
        }
      }
    },
    Initializer_expr: function*(interp, s, param) {
      rt = interp.rt;
      return (yield* interp.visit(interp, s.Expression, param));
    },
    Label_case: function*(interp, s, param) {
      var ce;
      rt = interp.rt;
      ce = (yield* interp.visit(interp, s.ConstantExpression));
      if (param["switch"] === void 0) {
        rt.raiseException("you cannot use case outside switch block");
      }
      if (param.scope === "SelectionStatement_switch_cs") {
        return ["switch", rt.cast(ce.t, param["switch"]).v === ce.v];
      } else {
        rt.raiseException("you can only use case directly in a switch block");
      }
    },
    Label_default: function(interp, s, param) {
      rt = interp.rt;
      if (param["switch"] === void 0) {
        rt.raiseException("you cannot use default outside switch block");
      }
      if (param.scope === "SelectionStatement_switch_cs") {
        return ["switch", true];
      } else {
        rt.raiseException("you can only use default directly in a switch block");
      }
    },
    CompoundStatement: function*(interp, s, param) {
      var _scope, i, k, len, r, stmt, stmts, switchon;
      rt = interp.rt;
      stmts = s.Statements;
      r = void 0;
      i = void 0;
      _scope = param.scope;
      if (param.scope === "SelectionStatement_switch") {
        param.scope = "SelectionStatement_switch_cs";
        rt.enterScope(param.scope);
        switchon = false;
        i = 0;
        while (i < stmts.length) {
          stmt = stmts[i];
          if (stmt.type === "Label_case" || stmt.type === "Label_default") {
            r = (yield* interp.visit(interp, stmt, param));
            if (r[1]) {
              switchon = true;
            }
          } else if (switchon) {
            r = (yield* interp.visit(interp, stmt, param));
            if (r instanceof Array) {
              return r;
            }
          }
          i++;
        }
        rt.exitScope(param.scope);
        param.scope = _scope;
      } else {
        param.scope = "CompoundStatement";
        rt.enterScope(param.scope);
        for (k = 0, len = stmts.length; k < len; k++) {
          stmt = stmts[k];
          r = (yield* interp.visit(interp, stmt, param));
          if (r instanceof Array) {
            break;
          }
        }
        rt.exitScope(param.scope);
        param.scope = _scope;
        return r;
      }
    },
    ExpressionStatement: function*(interp, s, param) {
      rt = interp.rt;
      if (s.Expression != null) {
        (yield* interp.visit(interp, s.Expression, param));
      }
    },
    SelectionStatement_if: function*(interp, s, param) {
      var e, ret, scope_bak;
      rt = interp.rt;
      scope_bak = param.scope;
      param.scope = "SelectionStatement_if";
      rt.enterScope(param.scope);
      e = (yield* interp.visit(interp, s.Expression, param));
      ret = void 0;
      if (rt.cast(rt.boolTypeLiteral, e).v) {
        ret = (yield* interp.visit(interp, s.Statement, param));
      } else if (s.ElseStatement) {
        ret = (yield* interp.visit(interp, s.ElseStatement, param));
      }
      rt.exitScope(param.scope);
      param.scope = scope_bak;
      return ret;
    },
    SelectionStatement_switch: function*(interp, s, param) {
      var e, r, ret, scope_bak, switch_bak;
      rt = interp.rt;
      scope_bak = param.scope;
      param.scope = "SelectionStatement_switch";
      rt.enterScope(param.scope);
      e = (yield* interp.visit(interp, s.Expression, param));
      switch_bak = param["switch"];
      param["switch"] = e;
      r = (yield* interp.visit(interp, s.Statement, param));
      param["switch"] = switch_bak;
      ret = void 0;
      if (r instanceof Array) {
        if (r[0] !== "break") {
          ret = r;
        }
      }
      rt.exitScope(param.scope);
      param.scope = scope_bak;
      return ret;
    },
    IterationStatement_while: function*(interp, s, param) {
      var cond, end_loop, r, return_val, scope_bak;
      rt = interp.rt;
      scope_bak = param.scope;
      param.scope = "IterationStatement_while";
      rt.enterScope(param.scope);
      while (true) {
        if (s.Expression != null) {
          cond = (yield* interp.visit(interp, s.Expression, param));
          cond = rt.cast(rt.boolTypeLiteral, cond).v;
          if (!cond) {
            break;
          }
        }
        r = (yield* interp.visit(interp, s.Statement, param));
        if (r instanceof Array) {
          switch (r[0]) {
            case "continue":
              break;
            case "break":
              end_loop = true;
              break;
            case "return":
              return_val = r;
              end_loop = true;
          }
          if (end_loop) {
            break;
          }
        }
      }
      rt.exitScope(param.scope);
      param.scope = scope_bak;
      return return_val;
    },
    IterationStatement_do: function*(interp, s, param) {
      var cond, end_loop, r, return_val, scope_bak;
      rt = interp.rt;
      scope_bak = param.scope;
      param.scope = "IterationStatement_do";
      rt.enterScope(param.scope);
      while (true) {
        r = (yield* interp.visit(interp, s.Statement, param));
        if (r instanceof Array) {
          switch (r[0]) {
            case "continue":
              break;
            case "break":
              end_loop = true;
              break;
            case "return":
              return_val = r;
              end_loop = true;
          }
          if (end_loop) {
            break;
          }
        }
        if (s.Expression != null) {
          cond = (yield* interp.visit(interp, s.Expression, param));
          cond = rt.cast(rt.boolTypeLiteral, cond).v;
          if (!cond) {
            break;
          }
        }
      }
      rt.exitScope(param.scope);
      param.scope = scope_bak;
      return return_val;
    },
    IterationStatement_for: function*(interp, s, param) {
      var cond, end_loop, r, return_val, scope_bak;
      rt = interp.rt;
      scope_bak = param.scope;
      param.scope = "IterationStatement_for";
      rt.enterScope(param.scope);
      if (s.Initializer) {
        if (s.Initializer.type === "Declaration") {
          (yield* interp.visit(interp, s.Initializer, param));
        } else {
          (yield* interp.visit(interp, s.Initializer, param));
        }
      }
      while (true) {
        if (s.Expression != null) {
          cond = (yield* interp.visit(interp, s.Expression, param));
          cond = rt.cast(rt.boolTypeLiteral, cond).v;
          if (!cond) {
            break;
          }
        }
        r = (yield* interp.visit(interp, s.Statement, param));
        if (r instanceof Array) {
          switch (r[0]) {
            case "continue":
              break;
            case "break":
              end_loop = true;
              break;
            case "return":
              return_val = r;
              end_loop = true;
          }
          if (end_loop) {
            break;
          }
        }
        if (s.Loop) {
          (yield* interp.visit(interp, s.Loop, param));
        }
      }
      rt.exitScope(param.scope);
      param.scope = scope_bak;
      return return_val;
    },
    JumpStatement_goto: function(interp, s, param) {
      rt = interp.rt;
      rt.raiseException("not implemented");
    },
    JumpStatement_continue: function(interp, s, param) {
      rt = interp.rt;
      return ["continue"];
    },
    JumpStatement_break: function(interp, s, param) {
      rt = interp.rt;
      return ["break"];
    },
    JumpStatement_return: function*(interp, s, param) {
      var ret;
      rt = interp.rt;
      if (s.Expression) {
        ret = (yield* interp.visit(interp, s.Expression, param));
        return ["return", ret];
      }
      return ["return"];
    },
    IdentifierExpression: function(interp, s, param) {
      rt = interp.rt;
      return rt.readVar(s.Identifier);
    },
    ParenthesesExpression: function*(interp, s, param) {
      rt = interp.rt;
      return (yield* interp.visit(interp, s.Expression, param));
    },
    PostfixExpression_ArrayAccess: function*(interp, s, param) {
      var index, r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      index = (yield* interp.visit(interp, s.index, param));
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName("[]"), [index.t])(rt, ret, index);
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    PostfixExpression_MethodInvocation: function*(interp, s, param) {
      var args, bindThis, e, r, ret, thisArg;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      args = (yield* (function*() {
        var k, len, ref, results;
        ref = s.args;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          e = ref[k];
          thisArg = (yield* interp.visit(interp, e, param));
          results.push(thisArg);
        }
        return results;
      })());
      if (ret.v.bindThis != null) {
        bindThis = ret.v.bindThis;
      } else {
        bindThis = ret;
      }
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName("()"), args.map(function(e) {
        return e.t;
      }))(rt, ret, bindThis, args);
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    PostfixExpression_MemberAccess: function*(interp, s, param) {
      var ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      return rt.getMember(ret, s.member);
    },
    PostfixExpression_MemberPointerAccess: function*(interp, s, param) {
      var member, r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      member = void 0;
      if (rt.isPointerType(ret.t) && !rt.isFunctionType(ret.t)) {
        member = s.member;
        r = rt.getFunc(ret.t, rt.makeOperatorFuncName("->"), [])(rt, ret, member);
        if (isGenerator(r)) {
          return (yield* r);
        } else {
          return r;
        }
      } else {
        member = (yield* interp.visit(interp, {
          type: "IdentifierExpression",
          Identifier: s.member
        }, param));
        r = rt.getFunc(ret.t, rt.makeOperatorFuncName("->"), [member.t])(rt, ret, member);
        if (isGenerator(r)) {
          return (yield* r);
        } else {
          return r;
        }
      }
    },
    PostfixExpression_PostIncrement: function*(interp, s, param) {
      var r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName("++"), ["dummy"])(rt, ret, {
        t: "dummy",
        v: null
      });
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    PostfixExpression_PostDecrement: function*(interp, s, param) {
      var r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName("--"), ["dummy"])(rt, ret, {
        t: "dummy",
        v: null
      });
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    UnaryExpression_PreIncrement: function*(interp, s, param) {
      var r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName("++"), [])(rt, ret);
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    UnaryExpression_PreDecrement: function*(interp, s, param) {
      var r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName("--"), [])(rt, ret);
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    UnaryExpression: function*(interp, s, param) {
      var r, ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      r = rt.getFunc(ret.t, rt.makeOperatorFuncName(s.op), [])(rt, ret);
      if (isGenerator(r)) {
        return (yield* r);
      } else {
        return r;
      }
    },
    UnaryExpression_Sizeof_Expr: function*(interp, s, param) {
      var ret;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      return rt.val(rt.intTypeLiteral, rt.getSize(ret));
    },
    UnaryExpression_Sizeof_Type: function*(interp, s, param) {
      var type;
      rt = interp.rt;
      type = (yield* interp.visit(interp, s.TypeName, param));
      return rt.val(rt.intTypeLiteral, rt.getSizeByType(type));
    },
    CastExpression: function*(interp, s, param) {
      var ret, type;
      rt = interp.rt;
      ret = (yield* interp.visit(interp, s.Expression, param));
      type = (yield* interp.visit(interp, s.TypeName, param));
      return rt.cast(type, ret);
    },
    TypeName: function(interp, s, param) {
      var baseType, k, len, ref, typename;
      rt = interp.rt;
      typename = [];
      ref = s.base;
      for (k = 0, len = ref.length; k < len; k++) {
        baseType = ref[k];
        if (baseType !== "const") {
          typename.push(baseType);
        }
      }
      return rt.simpleType(typename);
    },
    BinOpExpression: function*(interp, s, param) {
      var left, op, r, right;
      rt = interp.rt;
      op = s.op;
      if (op === "&&") {
        s.type = "LogicalANDExpression";
        return (yield* interp.visit(interp, s, param));
      } else if (op === "||") {
        s.type = "LogicalORExpression";
        return (yield* interp.visit(interp, s, param));
      } else {
        left = (yield* interp.visit(interp, s.left, param));
        right = (yield* interp.visit(interp, s.right, param));
        r = rt.getFunc(left.t, rt.makeOperatorFuncName(op), [right.t])(rt, left, right);
        if (isGenerator(r)) {
          return (yield* r);
        } else {
          return r;
        }
      }
    },
    LogicalANDExpression: function*(interp, s, param) {
      var left, lt, r, right;
      rt = interp.rt;
      left = (yield* interp.visit(interp, s.left, param));
      lt = rt.types[rt.getTypeSignature(left.t)];
      if ("&&" in lt) {
        right = (yield* interp.visit(interp, s.right, param));
        r = rt.getFunc(left.t, rt.makeOperatorFuncName("&&"), [right.t])(rt, left, right);
        if (isGenerator(r)) {
          return (yield* r);
        } else {
          return r;
        }
      } else {
        if (rt.cast(rt.boolTypeLiteral, left).v) {
          return (yield* interp.visit(interp, s.right, param));
        } else {
          return left;
        }
      }
    },
    LogicalORExpression: function*(interp, s, param) {
      var left, lt, r, right;
      rt = interp.rt;
      left = (yield* interp.visit(interp, s.left, param));
      lt = rt.types[rt.getTypeSignature(left.t)];
      if ("||" in lt) {
        right = (yield* interp.visit(interp, s.right, param));
        r = rt.getFunc(left.t, rt.makeOperatorFuncName("||"), [right.t])(rt, left, right);
        if (isGenerator(r)) {
          return (yield* r);
        } else {
          return r;
        }
      } else {
        if (rt.cast(rt.boolTypeLiteral, left).v) {
          return left;
        } else {
          return (yield* interp.visit(interp, s.right, param));
        }
      }
    },
    ConditionalExpression: function*(interp, s, param) {
      var cond;
      rt = interp.rt;
      cond = rt.cast(rt.boolTypeLiteral, (yield* interp.visit(interp, s.cond, param))).v;
      if (cond) {
        return (yield* interp.visit(interp, s.t, param));
      } else {
        return (yield* interp.visit(interp, s.f, param));
      }
    },
    ConstantExpression: function*(interp, s, param) {
      rt = interp.rt;
      return (yield* interp.visit(interp, s.Expression, param));
    },
    StringLiteralExpression: function*(interp, s, param) {
      return (yield* interp.visit(interp, s.value, param));
    },
    StringLiteral: function(interp, s, param) {
      var code, i, k, len, limits, maxCode, minCode, ref, typeName;
      rt = interp.rt;
      switch (s.prefix) {
        case null:
          maxCode = -1;
          minCode = 1;
          ref = s.value;
          for (k = 0, len = ref.length; k < len; k++) {
            i = ref[k];
            code = i.charCodeAt(0);
            if (maxCode < code) {
              maxCode = code;
            }
            if (minCode > code) {
              minCode = code;
            }
          }
          limits = rt.config.limits;
          typeName = maxCode <= limits["char"].max && minCode >= limits["char"].min ? "char" : "wchar_t";
          return rt.makeCharArrayFromString(s.value, typeName);
        case "L":
          return rt.makeCharArrayFromString(s.value, "wchar_t");
        case "u8":
          return rt.makeCharArrayFromString(s.value, "char");
        case "u":
          return rt.makeCharArrayFromString(s.value, "char16_t");
        case "U":
          return rt.makeCharArrayFromString(s.value, "char32_t");
      }
    },
    BooleanConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.boolTypeLiteral, s.value === "true" ? 1 : 0);
    },
    CharacterConstant: function(interp, s, param) {
      var a;
      rt = interp.rt;
      a = s.Char;
      if (a.length !== 1) {
        rt.raiseException("a character constant must have and only have one character.");
      }
      return rt.val(rt.charTypeLiteral, a[0].charCodeAt(0));
    },
    FloatConstant: function*(interp, s, param) {
      var val;
      rt = interp.rt;
      val = (yield* interp.visit(interp, s.Expression, param));
      return rt.val(rt.floatTypeLiteral, val.v);
    },
    DecimalConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.unsignedintTypeLiteral, parseInt(s.value, 10));
    },
    HexConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.unsignedintTypeLiteral, parseInt(s.value, 16));
    },
    BinaryConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.unsignedintTypeLiteral, parseInt(s.value, 2));
    },
    DecimalFloatConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.doubleTypeLiteral, parseFloat(s.value));
    },
    HexFloatConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.doubleTypeLiteral, parseFloat(s.value, 16));
    },
    OctalConstant: function(interp, s, param) {
      rt = interp.rt;
      return rt.val(rt.unsignedintTypeLiteral, parseInt(s.value, 8));
    },
    NamespaceDefinition: function(interp, s, param) {
      rt = interp.rt;
      rt.raiseException("not implemented");
    },
    UsingDirective: function(interp, s, param) {
      var id;
      rt = interp.rt;
      id = s.Identifier;
    },
    UsingDeclaration: function(interp, s, param) {
      rt = interp.rt;
      rt.raiseException("not implemented");
    },
    NamespaceAliasDefinition: function(interp, s, param) {
      rt = interp.rt;
      rt.raiseException("not implemented");
    },
    unknown: function(interp, s, param) {
      rt = interp.rt;
      rt.raiseException("unhandled syntax " + s.type);
    }
  };
};

Interpreter.prototype.visit = function*(interp, s, param) {
  var _node, f, ret, rt;
  rt = interp.rt;
  if ("type" in s) {
    if (param === void 0) {
      param = {
        scope: "global"
      };
    }
    _node = this.currentNode;
    this.currentNode = s;
    if (s.type in this.visitors) {
      f = this.visitors[s.type];
      if (isGeneratorFunction(f)) {
        ret = (yield* f(interp, s, param));
      } else {
        (yield (ret = f(interp, s, param)));
      }
    } else {
      ret = this.visitors["unknown"](interp, s, param);
    }
    this.currentNode = _node;
  } else {
    this.currentNode = s;
    this.rt.raiseException("untyped syntax structure");
  }
  return ret;
};

Interpreter.prototype.run = function*(tree) {
  this.rt.interp = this;
  return (yield* this.visit(this, tree));
};

Interpreter.prototype.arrayInit = function*(dimensions, init, level, type, param) {
  var _init, arr, curDim, i, initializer, initval, ret, val;
  arr = void 0;
  i = void 0;
  ret = void 0;
  initval = void 0;
  if (dimensions.length > level) {
    curDim = dimensions[level];
    if (init) {
      if (init.type === "Initializer_array" && curDim >= init.Initializers.length && (init.Initializers.length === 0 || init.Initializers[0].type === "Initializer_expr")) {
        if (init.Initializers.length === 0) {
          arr = new Array(curDim);
          i = 0;
          while (i < curDim) {
            arr[i] = {
              type: "Initializer_expr",
              shorthand: this.rt.defaultValue(type)
            };
            i++;
          }
          init.Initializers = arr;
        } else if (init.Initializers.length === 1 && this.rt.isIntegerType(type)) {
          val = this.rt.cast(type, (yield* this.visit(this, init.Initializers[0].Expression, param)));
          if (val.v === -1 || val.v === 0) {
            arr = new Array(curDim);
            i = 0;
            while (i < curDim) {
              arr[i] = {
                type: "Initializer_expr",
                shorthand: this.rt.val(type, val.v)
              };
              i++;
            }
            init.Initializers = arr;
          } else {
            arr = new Array(curDim);
            arr[0] = this.rt.val(type, -1);
            i = 1;
            while (i < curDim) {
              arr[i] = {
                type: "Initializer_expr",
                shorthand: this.rt.defaultValue(type)
              };
              i++;
            }
            init.Initializers = arr;
          }
        } else {
          arr = new Array(curDim);
          i = 0;
          while (i < init.Initializers.length) {
            _init = init.Initializers[i];
            if ("shorthand" in _init) {
              initval = _init;
            } else {
              initval = {
                type: "Initializer_expr",
                shorthand: (yield* this.visit(this, _init.Expression, param))
              };
            }
            arr[i] = initval;
            i++;
          }
          i = init.Initializers.length;
          while (i < curDim) {
            arr[i] = {
              type: "Initializer_expr",
              shorthand: this.rt.defaultValue(type)
            };
            i++;
          }
          init.Initializers = arr;
        }
      } else if (init.type === "Initializer_expr") {
        initializer = void 0;
        if ("shorthand" in init) {
          initializer = init.shorthand;
        } else {
          initializer = (yield* this.visit(this, init, param));
        }
        if (this.rt.isCharType(type) && this.rt.isArrayType(initializer.t) && this.rt.isCharType(initializer.t.eleType)) {
          init = {
            type: "Initializer_array",
            Initializers: initializer.v.target.map(function(e) {
              return {
                type: "Initializer_expr",
                shorthand: e
              };
            })
          };
        } else {
          this.rt.raiseException("cannot initialize an array to " + this.rt.makeValString(initializer));
        }
      } else {
        this.rt.raiseException("dimensions do not agree, " + curDim + " != " + init.Initializers.length);
      }
    }
    arr = [];
    ret = this.rt.val(this.arrayType(dimensions, level, type), this.rt.makeArrayPointerValue(arr, 0), true);
    i = 0;
    while (i < curDim) {
      if (init && i < init.Initializers.length) {
        arr[i] = (yield* this.arrayInit(dimensions, init.Initializers[i], level + 1, type, param));
      } else {
        arr[i] = (yield* this.arrayInit(dimensions, null, level + 1, type, param));
      }
      i++;
    }
    return ret;
  } else {
    if (init && init.type !== "Initializer_expr") {
      this.rt.raiseException("dimensions do not agree, too few initializers");
    }
    if (init) {
      if ("shorthand" in init) {
        initval = init.shorthand;
      } else {
        initval = (yield* this.visit(this, init.Expression, param));
      }
    } else {
      initval = this.rt.defaultValue(type);
    }
    ret = this.rt.cast(type, initval);
    ret.left = true;
    return ret;
  }
};

Interpreter.prototype.arrayType = function(dimensions, level, type) {
  if (dimensions.length > level) {
    return this.rt.arrayPointerType(this.arrayType(dimensions, level + 1, type), dimensions[level]);
  } else {
    return type;
  }
};

Interpreter.prototype.buildRecursivePointerType = function(pointer, basetype, level) {
  var type;
  if (pointer && pointer.length > level) {
    type = this.rt.normalPointerType(basetype);
    return this.buildRecursivePointerType(pointer, type, level + 1);
  } else {
    return basetype;
  }
};

module.exports = Interpreter;

},{}],13:[function(require,module,exports){
(function (process){
var CRuntime, Debugger, Interpreter, PEGUtil, alias, ast, headerAlias, includes, mergeConfig, preprocessor, realName;

CRuntime = require("./rt");

Interpreter = require("./interpreter");

ast = require("./ast");

preprocessor = require("./preprocessor");

Debugger = require("./debugger");

PEGUtil = require("pegjs-util");

mergeConfig = function(a, b) {
  var o;
  for (o in b) {
    if (o in a && typeof b[o] === "object") {
      mergeConfig(a[o], b[o]);
    } else {
      a[o] = b[o];
    }
  }
};

includes = {
  iostream: require("./includes/iostream"),
  cctype: require("./includes/cctype"),
  cstring: require("./includes/cstring"),
  cmath: require("./includes/cmath"),
  cstdio: require("./includes/cstdio"),
  cstdlib: require("./includes/cstdlib"),
  iomanip: require("./includes/iomanip")
};

headerAlias = {
  "ctype.h": "cctype",
  "string.h": "cstring",
  "math.h": "cmath",
  "stdio.h": "cstdio",
  "stdlib.h": "cstdlib"
};

for (alias in headerAlias) {
  realName = headerAlias[alias];
  includes[alias] = includes[realName];
}

module.exports = {
  includes: includes,
  run: function(code, input, config) {
    var _config, defGen, inputbuffer, interpreter, mainGen, mydebugger, result, rt, self, step;
    inputbuffer = input.toString();
    self = this;
    _config = {
      stdio: {
        drain: function() {
          var x;
          x = inputbuffer;
          inputbuffer = null;
          return x;
        },
        write: function(s) {
          process.stdout.write(s);
        }
      },
      includes: self.includes
    };
    mergeConfig(_config, config);
    rt = new CRuntime(_config);
    code = code.toString();
    code = preprocessor.parse(rt, code);
    mydebugger = new Debugger();
    if (_config.debug) {
      mydebugger.src = code;
    }
    result = PEGUtil.parse(ast, code);
    if (result.error != null) {
      throw new Error(JSON.stringify({text: "Syntax Error:\n" + PEGUtil.errorMessage(result.error, true), error: result.error}));
    }
    interpreter = new Interpreter(rt);
    defGen = interpreter.run(result.ast);
    while (true) {
      step = defGen.next();
      if (step.done) {
        break;
      }
    }
    mainGen = rt.getFunc("global", "main", [])(rt, null, []);
    if (_config.debug) {
      mydebugger.start(rt, mainGen);
      return mydebugger;
    } else {
      while (true) {
        step = mainGen.next();
        if (step.done) {
          break;
        }
      }
      return step.value.v;
    }
  }
};

}).call(this,require('_process'))
},{"./ast":1,"./debugger":2,"./includes/cctype":4,"./includes/cmath":5,"./includes/cstdio":6,"./includes/cstdlib":7,"./includes/cstring":8,"./includes/iomanip":9,"./includes/iostream":10,"./interpreter":12,"./preprocessor":16,"./rt":17,"_process":26,"pegjs-util":44}],14:[function(require,module,exports){
module.exports = require("./launcher");

},{"./launcher":13}],15:[function(require,module,exports){
module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { TranslationUnit: peg$parseTranslationUnit },
        peg$startRuleFunction  = peg$parseTranslationUnit,

        peg$c0 = function(a, b) {
                return addPositionInfo({type:'Code', val:a, space:b})
                },
        peg$c1 = function(a) {
                return addPositionInfo({type:'TranslationUnit', lines: a});
            },
        peg$c2 = function(a, b) {a.space = b;return a;},
        peg$c3 = function(a) {return addPositionInfo({type:'PrepUndef', Identifier:a});},
        peg$c4 = function(a, b) {
            return addPositionInfo({type:'PrepSimpleMacro', Identifier:a, Replacement:b});
        },
        peg$c5 = function(a, b, c) {
            return addPositionInfo({type:'PrepFunctionMacro', Identifier:a, Args:b, Replacement:c});
        },
        peg$c6 = function(a) {return a;},
        peg$c7 = function(a, b) {
            return [a].concat(b);
        },
        peg$c8 = function(a, b, c) {
            return {type:'PrepFunctionMacroCall', Identifier:a, Args:b, space:c};
            },
        peg$c9 = function(a) {
            var ret = [];
            var lastString = null;
            for (var i=0;i<a.length;i++){
                if (a[i].type==='Seperator'){
                    if (lastString===null){
                        lastString = a[i];
                    }else{
                        lastString.val += lastString.space + a[i].val;
                        lastString.space = a[i].space;
                    }
                }else{
                    if (lastString!==null){
                        ret.push(lastString);
                        lastString = null;
                    }
                    ret.push(a[i]);
                }
            }
            if (lastString!==null)
                ret.push(lastString);
            return ret;
        },
        peg$c10 = function(a) {
            return addPositionInfo({type:'PrepIncludeLib', name:a});
        },
        peg$c11 = function(a) {
            return addPositionInfo({type:'PrepIncludeLocal', name:a});
        },
        peg$c12 = /^[\/\\.]/,
        peg$c13 = { type: "class", value: "[/\\\\.]", description: "[/\\\\.]" },
        peg$c14 = function(a) {return a.join('');},
        peg$c15 = function(a) {return addPositionInfo({type:'PrepIfdef', Identifier:a});},
        peg$c16 = function(a) {return addPositionInfo({type:'PrepIfndef', Identifier:a});},
        peg$c17 = function() {return addPositionInfo({type:'PrepEndif'});},
        peg$c18 = function() {return addPositionInfo({type:'PrepElse'});},
        peg$c19 = "#",
        peg$c20 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c21 = "define",
        peg$c22 = { type: "literal", value: "define", description: "\"define\"" },
        peg$c23 = "undef",
        peg$c24 = { type: "literal", value: "undef", description: "\"undef\"" },
        peg$c25 = "include",
        peg$c26 = { type: "literal", value: "include", description: "\"include\"" },
        peg$c27 = "ifdef",
        peg$c28 = { type: "literal", value: "ifdef", description: "\"ifdef\"" },
        peg$c29 = "ifndef",
        peg$c30 = { type: "literal", value: "ifndef", description: "\"ifndef\"" },
        peg$c31 = "endif",
        peg$c32 = { type: "literal", value: "endif", description: "\"endif\"" },
        peg$c33 = "else",
        peg$c34 = { type: "literal", value: "else", description: "\"else\"" },
        peg$c35 = function(a) {
                return a.join('');
              },
        peg$c36 = /^[ \t\x0B\f]/,
        peg$c37 = { type: "class", value: "[ \\t\\u000B\\u000C]", description: "[ \\t\\u000B\\u000C]" },
        peg$c38 = /^[ \n\r\t\x0B\f]/,
        peg$c39 = { type: "class", value: "[ \\n\\r\\t\\u000B\\u000C]", description: "[ \\n\\r\\t\\u000B\\u000C]" },
        peg$c40 = "/*",
        peg$c41 = { type: "literal", value: "/*", description: "\"/*\"" },
        peg$c42 = "*/",
        peg$c43 = { type: "literal", value: "*/", description: "\"*/\"" },
        peg$c44 = function(a) {return '';},
        peg$c45 = "//",
        peg$c46 = { type: "literal", value: "//", description: "\"//\"" },
        peg$c47 = "\n",
        peg$c48 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c49 = "auto",
        peg$c50 = { type: "literal", value: "auto", description: "\"auto\"" },
        peg$c51 = "break",
        peg$c52 = { type: "literal", value: "break", description: "\"break\"" },
        peg$c53 = "case",
        peg$c54 = { type: "literal", value: "case", description: "\"case\"" },
        peg$c55 = "char",
        peg$c56 = { type: "literal", value: "char", description: "\"char\"" },
        peg$c57 = "const",
        peg$c58 = { type: "literal", value: "const", description: "\"const\"" },
        peg$c59 = "continue",
        peg$c60 = { type: "literal", value: "continue", description: "\"continue\"" },
        peg$c61 = "default",
        peg$c62 = { type: "literal", value: "default", description: "\"default\"" },
        peg$c63 = "double",
        peg$c64 = { type: "literal", value: "double", description: "\"double\"" },
        peg$c65 = "do",
        peg$c66 = { type: "literal", value: "do", description: "\"do\"" },
        peg$c67 = "enum",
        peg$c68 = { type: "literal", value: "enum", description: "\"enum\"" },
        peg$c69 = "extern",
        peg$c70 = { type: "literal", value: "extern", description: "\"extern\"" },
        peg$c71 = "float",
        peg$c72 = { type: "literal", value: "float", description: "\"float\"" },
        peg$c73 = "for",
        peg$c74 = { type: "literal", value: "for", description: "\"for\"" },
        peg$c75 = "goto",
        peg$c76 = { type: "literal", value: "goto", description: "\"goto\"" },
        peg$c77 = "if",
        peg$c78 = { type: "literal", value: "if", description: "\"if\"" },
        peg$c79 = "int",
        peg$c80 = { type: "literal", value: "int", description: "\"int\"" },
        peg$c81 = "inline",
        peg$c82 = { type: "literal", value: "inline", description: "\"inline\"" },
        peg$c83 = "long",
        peg$c84 = { type: "literal", value: "long", description: "\"long\"" },
        peg$c85 = "register",
        peg$c86 = { type: "literal", value: "register", description: "\"register\"" },
        peg$c87 = "restrict",
        peg$c88 = { type: "literal", value: "restrict", description: "\"restrict\"" },
        peg$c89 = "return",
        peg$c90 = { type: "literal", value: "return", description: "\"return\"" },
        peg$c91 = "short",
        peg$c92 = { type: "literal", value: "short", description: "\"short\"" },
        peg$c93 = "signed",
        peg$c94 = { type: "literal", value: "signed", description: "\"signed\"" },
        peg$c95 = "sizeof",
        peg$c96 = { type: "literal", value: "sizeof", description: "\"sizeof\"" },
        peg$c97 = "static",
        peg$c98 = { type: "literal", value: "static", description: "\"static\"" },
        peg$c99 = "struct",
        peg$c100 = { type: "literal", value: "struct", description: "\"struct\"" },
        peg$c101 = "switch",
        peg$c102 = { type: "literal", value: "switch", description: "\"switch\"" },
        peg$c103 = "typedef",
        peg$c104 = { type: "literal", value: "typedef", description: "\"typedef\"" },
        peg$c105 = "union",
        peg$c106 = { type: "literal", value: "union", description: "\"union\"" },
        peg$c107 = "unsigned",
        peg$c108 = { type: "literal", value: "unsigned", description: "\"unsigned\"" },
        peg$c109 = "void",
        peg$c110 = { type: "literal", value: "void", description: "\"void\"" },
        peg$c111 = "volatile",
        peg$c112 = { type: "literal", value: "volatile", description: "\"volatile\"" },
        peg$c113 = "while",
        peg$c114 = { type: "literal", value: "while", description: "\"while\"" },
        peg$c115 = "_Bool",
        peg$c116 = { type: "literal", value: "_Bool", description: "\"_Bool\"" },
        peg$c117 = "_Complex",
        peg$c118 = { type: "literal", value: "_Complex", description: "\"_Complex\"" },
        peg$c119 = "_stdcall",
        peg$c120 = { type: "literal", value: "_stdcall", description: "\"_stdcall\"" },
        peg$c121 = "__declspec",
        peg$c122 = { type: "literal", value: "__declspec", description: "\"__declspec\"" },
        peg$c123 = "__attribute__",
        peg$c124 = { type: "literal", value: "__attribute__", description: "\"__attribute__\"" },
        peg$c125 = "_Imaginary",
        peg$c126 = { type: "literal", value: "_Imaginary", description: "\"_Imaginary\"" },
        peg$c127 = function(a, b, c) {
            return {type: 'Identifier', val:a+b.join(''), space:c}
        },
        peg$c128 = /^[\r\n,)]/,
        peg$c129 = { type: "class", value: "[\\r\\n,)]", description: "[\\r\\n,)]" },
        peg$c130 = function(a, b) {
            return {type: 'Seperator', val:a, space:b}
        },
        peg$c131 = /^[\r\n]/,
        peg$c132 = { type: "class", value: "[\\r\\n]", description: "[\\r\\n]" },
        peg$c133 = /^[a-z]/,
        peg$c134 = { type: "class", value: "[a-z]", description: "[a-z]" },
        peg$c135 = /^[A-Z]/,
        peg$c136 = { type: "class", value: "[A-Z]", description: "[A-Z]" },
        peg$c137 = /^[_]/,
        peg$c138 = { type: "class", value: "[_]", description: "[_]" },
        peg$c139 = /^[0-9]/,
        peg$c140 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c141 = "\\u",
        peg$c142 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c143 = function(a) {return String.fromCharCode(a);},
        peg$c144 = "\\U",
        peg$c145 = { type: "literal", value: "\\U", description: "\"\\\\U\"" },
        peg$c146 = function(a) {
            return parseInt(a.join(''),16);
        },
        peg$c147 = /^[a-f]/,
        peg$c148 = { type: "class", value: "[a-f]", description: "[a-f]" },
        peg$c149 = /^[A-F]/,
        peg$c150 = { type: "class", value: "[A-F]", description: "[A-F]" },
        peg$c151 = "(",
        peg$c152 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c153 = ")",
        peg$c154 = { type: "literal", value: ")", description: "\")\"" },
        peg$c155 = ",",
        peg$c156 = { type: "literal", value: ",", description: "\",\"" },
        peg$c157 = "<",
        peg$c158 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c159 = /^[=]/,
        peg$c160 = { type: "class", value: "[=]", description: "[=]" },
        peg$c161 = ">",
        peg$c162 = { type: "literal", value: ">", description: "\">\"" },
        peg$c163 = "\"",
        peg$c164 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c165 = { type: "any", description: "any character" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseTranslationUnit() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseSpacing();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsePreprocessor();
        if (s3 === peg$FAILED) {
          s3 = peg$currPos;
          s4 = peg$parsePrepMacroText();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSpacing();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s3;
              s4 = peg$c0(s4, s5);
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parsePreprocessor();
            if (s3 === peg$FAILED) {
              s3 = peg$currPos;
              s4 = peg$parsePrepMacroText();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseSpacing();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c0(s4, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEOT();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c1(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePreprocessor() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsePrepDefine();
      if (s1 === peg$FAILED) {
        s1 = peg$parsePrepInclude();
        if (s1 === peg$FAILED) {
          s1 = peg$parseConditionalInclusion();
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepDefine() {
      var s0;

      s0 = peg$parsePrepFunctionMacro();
      if (s0 === peg$FAILED) {
        s0 = peg$parsePrepSimpleMacro();
        if (s0 === peg$FAILED) {
          s0 = peg$parsePrepUndef();
        }
      }

      return s0;
    }

    function peg$parsePrepUndef() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseUNDEF();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c3(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepSimpleMacro() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDEFINE();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsePrepMacroText();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c4(s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepFunctionMacro() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDEFINE();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsePrepFunctionMacroArgs();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsePrepMacroText();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c5(s3, s4, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepFunctionMacroArgs() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseLPAR();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          s5 = peg$parseCOMMA();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseIdentifier();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s4;
              s5 = peg$c6(s6);
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            s5 = peg$parseCOMMA();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseIdentifier();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s4;
                s5 = peg$c6(s6);
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c7(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepFunctionMacroCallArgs() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseLPAR();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsePrepMacroMacroCallText();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          s5 = peg$parseCOMMA();
          if (s5 !== peg$FAILED) {
            s6 = peg$parsePrepMacroMacroCallText();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s4;
              s5 = peg$c6(s6);
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$currPos;
            s5 = peg$parseCOMMA();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsePrepMacroMacroCallText();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s4;
                s5 = peg$c6(s6);
                s4 = s5;
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseRPAR();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c7(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepMacroMacroCallText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parseIdentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsePrepFunctionMacroCallArgs();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseInlineSpacing();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c8(s3, s4, s5);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 === peg$FAILED) {
          s2 = peg$parseSeperatorArgs();
        }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsePrepFunctionMacroCallArgs();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseInlineSpacing();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c8(s3, s4, s5);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = peg$parseIdentifier();
            if (s2 === peg$FAILED) {
              s2 = peg$parseSeperatorArgs();
            }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsePrepMacroText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parseIdentifier();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsePrepFunctionMacroCallArgs();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseInlineSpacing();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c8(s3, s4, s5);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = peg$parseIdentifier();
        if (s2 === peg$FAILED) {
          s2 = peg$parseSeperator();
        }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsePrepFunctionMacroCallArgs();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseInlineSpacing();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c8(s3, s4, s5);
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = peg$parseIdentifier();
            if (s2 === peg$FAILED) {
              s2 = peg$parseSeperator();
            }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c9(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsePrepInclude() {
      var s0;

      s0 = peg$parsePrepIncludeLib();
      if (s0 === peg$FAILED) {
        s0 = peg$parsePrepIncludeLocal();
      }

      return s0;
    }

    function peg$parsePrepIncludeLib() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseINCLUDE();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseLT();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseFilename();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseGT();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c10(s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepIncludeLocal() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseINCLUDE();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseQUO();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseFilename();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseQUO();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c11(s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFilename() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseIdChar();
      if (s2 === peg$FAILED) {
        if (peg$c12.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c13); }
        }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseIdChar();
          if (s2 === peg$FAILED) {
            if (peg$c12.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c13); }
            }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c14(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseConditionalInclusion() {
      var s0;

      s0 = peg$parsePrepIfdef();
      if (s0 === peg$FAILED) {
        s0 = peg$parsePrepIfndef();
        if (s0 === peg$FAILED) {
          s0 = peg$parsePrepEndif();
          if (s0 === peg$FAILED) {
            s0 = peg$parsePrepElse();
          }
        }
      }

      return s0;
    }

    function peg$parsePrepIfdef() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIFDEF();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c15(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepIfndef() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIFNDEF();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIdentifier();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c16(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepEndif() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseENDIF();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c17();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePrepElse() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseSHARP();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseELSE();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c18();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSHARP() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c19;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDEFINE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c21) {
        s1 = peg$c21;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c22); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUNDEF() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c23) {
        s1 = peg$c23;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c24); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseINCLUDE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIFDEF() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c27) {
        s1 = peg$c27;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIFNDEF() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c29) {
        s1 = peg$c29;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseENDIF() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c31) {
        s1 = peg$c31;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseELSE() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c33) {
        s1 = peg$c33;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseInlineSpacing() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseInlineWhiteSpace();
      if (s2 === peg$FAILED) {
        s2 = peg$parseLongComment();
        if (s2 === peg$FAILED) {
          s2 = peg$parseLineComment();
        }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseInlineWhiteSpace();
        if (s2 === peg$FAILED) {
          s2 = peg$parseLongComment();
          if (s2 === peg$FAILED) {
            s2 = peg$parseLineComment();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c35(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSpacing() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseWhiteSpace();
      if (s2 === peg$FAILED) {
        s2 = peg$parseLongComment();
        if (s2 === peg$FAILED) {
          s2 = peg$parseLineComment();
        }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseWhiteSpace();
        if (s2 === peg$FAILED) {
          s2 = peg$parseLongComment();
          if (s2 === peg$FAILED) {
            s2 = peg$parseLineComment();
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c35(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseInlineWhiteSpace() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c36.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c6(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseWhiteSpace() {
      var s0, s1;

      s0 = peg$currPos;
      if (peg$c38.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c6(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLongComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c40) {
        s1 = peg$c40;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c42) {
          s5 = peg$c42;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c43); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c42) {
            s5 = peg$c42;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c42) {
            s3 = peg$c42;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c43); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c44(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c45) {
        s1 = peg$c45;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c46); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 10) {
          s5 = peg$c47;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 10) {
            s5 = peg$c47;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c48); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = void 0;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c44(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseAUTO() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c49) {
        s1 = peg$c49;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBREAK() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c51) {
        s1 = peg$c51;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCASE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c53) {
        s1 = peg$c53;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCHAR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c55) {
        s1 = peg$c55;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c56); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCONST() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c57) {
        s1 = peg$c57;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c58); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCONTINUE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c59) {
        s1 = peg$c59;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c60); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDEFAULT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c61) {
        s1 = peg$c61;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c62); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDOUBLE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c63) {
        s1 = peg$c63;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c64); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDO() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c65) {
        s1 = peg$c65;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseELSE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c33) {
        s1 = peg$c33;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseENUM() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c67) {
        s1 = peg$c67;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEXTERN() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c69) {
        s1 = peg$c69;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFLOAT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c71) {
        s1 = peg$c71;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseFOR() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c73) {
        s1 = peg$c73;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c74); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGOTO() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c75) {
        s1 = peg$c75;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c76); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c77) {
        s1 = peg$c77;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c78); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseINT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c79) {
        s1 = peg$c79;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c80); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseINLINE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c81) {
        s1 = peg$c81;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c82); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLONG() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c83) {
        s1 = peg$c83;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c84); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseREGISTER() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c85) {
        s1 = peg$c85;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c86); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRESTRICT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c87) {
        s1 = peg$c87;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c88); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRETURN() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c89) {
        s1 = peg$c89;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSHORT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c91) {
        s1 = peg$c91;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c92); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSIGNED() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c93) {
        s1 = peg$c93;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c94); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSIZEOF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c95) {
        s1 = peg$c95;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c96); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTATIC() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c97) {
        s1 = peg$c97;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTRUCT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c99) {
        s1 = peg$c99;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c100); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSWITCH() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c101) {
        s1 = peg$c101;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTYPEDEF() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c103) {
        s1 = peg$c103;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c104); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUNION() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c105) {
        s1 = peg$c105;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c106); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseUNSIGNED() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c107) {
        s1 = peg$c107;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c108); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseVOID() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c109) {
        s1 = peg$c109;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseVOLATILE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c111) {
        s1 = peg$c111;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c112); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseWHILE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c113) {
        s1 = peg$c113;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c114); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseBOOL() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c115) {
        s1 = peg$c115;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c116); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCOMPLEX() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c117) {
        s1 = peg$c117;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c118); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSTDCALL() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c119) {
        s1 = peg$c119;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c120); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDECLSPEC() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 10) === peg$c121) {
        s1 = peg$c121;
        peg$currPos += 10;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c122); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseATTRIBUTE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c123) {
        s1 = peg$c123;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c124); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseKeyword() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c49) {
        s1 = peg$c49;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c51) {
          s1 = peg$c51;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c52); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c53) {
            s1 = peg$c53;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c54); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c55) {
              s1 = peg$c55;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c56); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 5) === peg$c57) {
                s1 = peg$c57;
                peg$currPos += 5;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c58); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 8) === peg$c59) {
                  s1 = peg$c59;
                  peg$currPos += 8;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c60); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 7) === peg$c61) {
                    s1 = peg$c61;
                    peg$currPos += 7;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                  }
                  if (s1 === peg$FAILED) {
                    if (input.substr(peg$currPos, 6) === peg$c63) {
                      s1 = peg$c63;
                      peg$currPos += 6;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c64); }
                    }
                    if (s1 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c65) {
                        s1 = peg$c65;
                        peg$currPos += 2;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c66); }
                      }
                      if (s1 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c33) {
                          s1 = peg$c33;
                          peg$currPos += 4;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c34); }
                        }
                        if (s1 === peg$FAILED) {
                          if (input.substr(peg$currPos, 4) === peg$c67) {
                            s1 = peg$c67;
                            peg$currPos += 4;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c68); }
                          }
                          if (s1 === peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c69) {
                              s1 = peg$c69;
                              peg$currPos += 6;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c70); }
                            }
                            if (s1 === peg$FAILED) {
                              if (input.substr(peg$currPos, 5) === peg$c71) {
                                s1 = peg$c71;
                                peg$currPos += 5;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c72); }
                              }
                              if (s1 === peg$FAILED) {
                                if (input.substr(peg$currPos, 3) === peg$c73) {
                                  s1 = peg$c73;
                                  peg$currPos += 3;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c74); }
                                }
                                if (s1 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 4) === peg$c75) {
                                    s1 = peg$c75;
                                    peg$currPos += 4;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c76); }
                                  }
                                  if (s1 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 2) === peg$c77) {
                                      s1 = peg$c77;
                                      peg$currPos += 2;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                    }
                                    if (s1 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 3) === peg$c79) {
                                        s1 = peg$c79;
                                        peg$currPos += 3;
                                      } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c80); }
                                      }
                                      if (s1 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 6) === peg$c81) {
                                          s1 = peg$c81;
                                          peg$currPos += 6;
                                        } else {
                                          s1 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c82); }
                                        }
                                        if (s1 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 4) === peg$c83) {
                                            s1 = peg$c83;
                                            peg$currPos += 4;
                                          } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                          }
                                          if (s1 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 8) === peg$c85) {
                                              s1 = peg$c85;
                                              peg$currPos += 8;
                                            } else {
                                              s1 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c86); }
                                            }
                                            if (s1 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 8) === peg$c87) {
                                                s1 = peg$c87;
                                                peg$currPos += 8;
                                              } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c88); }
                                              }
                                              if (s1 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 6) === peg$c89) {
                                                  s1 = peg$c89;
                                                  peg$currPos += 6;
                                                } else {
                                                  s1 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c90); }
                                                }
                                                if (s1 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 5) === peg$c91) {
                                                    s1 = peg$c91;
                                                    peg$currPos += 5;
                                                  } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c92); }
                                                  }
                                                  if (s1 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 6) === peg$c93) {
                                                      s1 = peg$c93;
                                                      peg$currPos += 6;
                                                    } else {
                                                      s1 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c94); }
                                                    }
                                                    if (s1 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 6) === peg$c95) {
                                                        s1 = peg$c95;
                                                        peg$currPos += 6;
                                                      } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c96); }
                                                      }
                                                      if (s1 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 6) === peg$c97) {
                                                          s1 = peg$c97;
                                                          peg$currPos += 6;
                                                        } else {
                                                          s1 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c98); }
                                                        }
                                                        if (s1 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 6) === peg$c99) {
                                                            s1 = peg$c99;
                                                            peg$currPos += 6;
                                                          } else {
                                                            s1 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c100); }
                                                          }
                                                          if (s1 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 6) === peg$c101) {
                                                              s1 = peg$c101;
                                                              peg$currPos += 6;
                                                            } else {
                                                              s1 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c102); }
                                                            }
                                                            if (s1 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 7) === peg$c103) {
                                                                s1 = peg$c103;
                                                                peg$currPos += 7;
                                                              } else {
                                                                s1 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c104); }
                                                              }
                                                              if (s1 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 5) === peg$c105) {
                                                                  s1 = peg$c105;
                                                                  peg$currPos += 5;
                                                                } else {
                                                                  s1 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c106); }
                                                                }
                                                                if (s1 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 8) === peg$c107) {
                                                                    s1 = peg$c107;
                                                                    peg$currPos += 8;
                                                                  } else {
                                                                    s1 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c108); }
                                                                  }
                                                                  if (s1 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 4) === peg$c109) {
                                                                      s1 = peg$c109;
                                                                      peg$currPos += 4;
                                                                    } else {
                                                                      s1 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c110); }
                                                                    }
                                                                    if (s1 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 8) === peg$c111) {
                                                                        s1 = peg$c111;
                                                                        peg$currPos += 8;
                                                                      } else {
                                                                        s1 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c112); }
                                                                      }
                                                                      if (s1 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 5) === peg$c113) {
                                                                          s1 = peg$c113;
                                                                          peg$currPos += 5;
                                                                        } else {
                                                                          s1 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c114); }
                                                                        }
                                                                        if (s1 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 5) === peg$c115) {
                                                                            s1 = peg$c115;
                                                                            peg$currPos += 5;
                                                                          } else {
                                                                            s1 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c116); }
                                                                          }
                                                                          if (s1 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 8) === peg$c117) {
                                                                              s1 = peg$c117;
                                                                              peg$currPos += 8;
                                                                            } else {
                                                                              s1 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c118); }
                                                                            }
                                                                            if (s1 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 10) === peg$c125) {
                                                                                s1 = peg$c125;
                                                                                peg$currPos += 10;
                                                                              } else {
                                                                                s1 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c126); }
                                                                              }
                                                                              if (s1 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 8) === peg$c119) {
                                                                                  s1 = peg$c119;
                                                                                  peg$currPos += 8;
                                                                                } else {
                                                                                  s1 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c120); }
                                                                                }
                                                                                if (s1 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 10) === peg$c121) {
                                                                                    s1 = peg$c121;
                                                                                    peg$currPos += 10;
                                                                                  } else {
                                                                                    s1 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c122); }
                                                                                  }
                                                                                  if (s1 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 13) === peg$c123) {
                                                                                      s1 = peg$c123;
                                                                                      peg$currPos += 13;
                                                                                    } else {
                                                                                      s1 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c124); }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdChar();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIdentifier() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      s2 = peg$parseKeyword();
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = void 0;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIdNondigit();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseIdChar();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseIdChar();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseInlineSpacing();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c127(s2, s3, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSeperatorArgs() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseKeyword();
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdNondigit();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          peg$silentFails++;
          if (peg$c128.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c129); }
          }
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = void 0;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c6(s4);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c130(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSeperator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseKeyword();
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;
        s3 = peg$parseIdNondigit();
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          peg$silentFails++;
          if (peg$c131.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c132); }
          }
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = void 0;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c6(s4);
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c130(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIdNondigit() {
      var s0;

      if (peg$c133.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c134); }
      }
      if (s0 === peg$FAILED) {
        if (peg$c135.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c136); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c137.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c138); }
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseUniversalCharacter();
          }
        }
      }

      return s0;
    }

    function peg$parseIdChar() {
      var s0;

      if (peg$c133.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c134); }
      }
      if (s0 === peg$FAILED) {
        if (peg$c135.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c136); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c139.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c140); }
          }
          if (s0 === peg$FAILED) {
            if (peg$c137.test(input.charAt(peg$currPos))) {
              s0 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c138); }
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseUniversalCharacter();
            }
          }
        }
      }

      return s0;
    }

    function peg$parseUniversalCharacter() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c141) {
        s1 = peg$c141;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c142); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseHexQuad();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c143(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c144) {
          s1 = peg$c144;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c145); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parseHexOcto();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c143(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseHexOcto() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseHexDigit();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseHexDigit();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseHexDigit();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseHexDigit();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseHexDigit();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseHexDigit();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseHexDigit();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseHexDigit();
                    if (s9 !== peg$FAILED) {
                      s2 = [s2, s3, s4, s5, s6, s7, s8, s9];
                      s1 = s2;
                    } else {
                      peg$currPos = s1;
                      s1 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$FAILED;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c146(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseHexQuad() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseHexDigit();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseHexDigit();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseHexDigit();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseHexDigit();
            if (s5 !== peg$FAILED) {
              s2 = [s2, s3, s4, s5];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c146(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseHexDigit() {
      var s0;

      if (peg$c147.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c148); }
      }
      if (s0 === peg$FAILED) {
        if (peg$c149.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c150); }
        }
        if (s0 === peg$FAILED) {
          if (peg$c139.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c140); }
          }
        }
      }

      return s0;
    }

    function peg$parseLPAR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c151;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c152); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRPAR() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 41) {
        s1 = peg$c153;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c154); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCOMMA() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s1 = peg$c155;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c156); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 60) {
        s1 = peg$c157;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c158); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c159.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c160); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseInlineSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseGT() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 62) {
        s1 = peg$c161;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c162); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        peg$silentFails++;
        if (peg$c159.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c160); }
        }
        peg$silentFails--;
        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseInlineSpacing();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c6(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseQUO() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c163;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c164); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInlineSpacing();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c6(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEOT() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      s1 = peg$parse_();
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = void 0;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c165); }
      }

      return s0;
    }


    function addPositionInfo(r){
        var posDetails = peg$computePosDetails(peg$currPos);
        r.line = posDetails.line;
        r.column = posDetails.column;
        r.begin = peg$savedPos;
        r.end = peg$currPos;
        return r;
    }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
},{}],16:[function(require,module,exports){
var PEGUtil, Preprocessor, prepast;

prepast = require("./prepast");

PEGUtil = require("pegjs-util");

Preprocessor = function(rt) {
  var pushInc, self;
  pushInc = function(b) {
    self.doinclude.push(self.doinclude[self.doinclude.length - 1] && b);
  };
  this.rt = rt;
  this.ret = "";
  this.macros = {};
  this.macroStack = [];
  this.doinclude = [true];
  self = this;
  this.visitors = {
    TranslationUnit: function(interp, s, code) {
      var dec, i;
      i = 0;
      while (i < s.lines.length) {
        dec = s.lines[i];
        interp.visit(dec, code);
        interp.ret += dec.space;
        i++;
      }
      return interp.ret;
    },
    Code: function(interp, s, code) {
      var i, x;
      if (interp.doinclude[interp.doinclude.length - 1]) {
        i = 0;
        while (i < s.val.length) {
          x = interp.work(s.val[i]);
          interp.ret += x;
          i++;
        }
      }
    },
    PrepSimpleMacro: function(interp, s, code) {
      interp.newMacro(s.Identifier, s.Replacement);
    },
    PrepFunctionMacro: function(interp, s, code) {
      interp.newMacroFunction(s.Identifier, s.Args, s.Replacement);
    },
    PrepIncludeLib: function(interp, s, code) {
      interp.rt.include(s.name);
    },
    PrepIncludeLocal: function(interp, s, code) {
      var includes;
      includes = interp.rt.config.includes;
      if (s.name in includes) {
        includes[s.name].load(interp.rt);
      } else {
        interp.rt.raiseException("cannot find file: " + s.name);
      }
    },
    PrepUndef: function(interp, s, code) {
      if (interp.isMacroDefined(s.Identifier)) {
        delete interp.macros[s.Identifier.val];
      }
    },
    PrepIfdef: function(interp, s, code) {
      pushInc(interp.isMacroDefined(s.Identifier));
    },
    PrepIfndef: function(interp, s, code) {
      pushInc(!interp.isMacroDefined(s.Identifier));
    },
    PrepElse: function(interp, s, code) {
      var x;
      if (interp.doinclude.length > 1) {
        x = interp.doinclude.pop();
        pushInc(!x);
      } else {
        interp.rt.raiseException("#else must be used after a #if");
      }
    },
    PrepEndif: function(interp, s, code) {
      if (interp.doinclude.length > 1) {
        interp.doinclude.pop();
      } else {
        interp.rt.raiseException("#endif must be used after a #if");
      }
    },
    unknown: function(interp, s, code) {
      interp.rt.raiseException("unhandled syntax " + s.type);
    }
  };
};

Preprocessor.prototype.visit = function(s, code) {
  var _node;
  if ("type" in s) {
    _node = this.currentNode;
    this.currentNode = s;
    if (s.type in this.visitors) {
      return this.visitors[s.type](this, s, code);
    } else {
      return this.visitors["unknown"](this, s, code);
    }
    this.currentNode = _node;
  } else {
    this.currentNode = s;
    this.rt.raiseException("untyped syntax structure: " + JSON.stringify(s));
  }
};

Preprocessor.prototype.isMacroDefined = function(node) {
  if (node.type === "Identifier") {
    return node.val in this.macros;
  } else {
    return node.Identifier.val in this.macros;
  }
};

Preprocessor.prototype.isMacro = function(node) {
  return this.isMacroDefined(node) && "val" in node && this.macros[node.val].type === "simple";
};

Preprocessor.prototype.isMacroFunction = function(node) {
  return this.isMacroDefined(node) && "Identifier" in node && this.macros[node.Identifier.val].type === "function";
};

Preprocessor.prototype.newMacro = function(id, replacement) {
  if (this.isMacroDefined(id)) {
    this.rt.raiseException("macro " + id.val + " is already defined");
  }
  this.macros[id.val] = {
    type: "simple",
    replacement: replacement
  };
};

Preprocessor.prototype.newMacroFunction = function(id, args, replacement) {
  if (this.isMacroDefined(id)) {
    this.rt.raiseException("macro " + id.val + " is already defined");
  }
  this.macros[id.val] = {
    type: "function",
    args: args,
    replacement: replacement
  };
};

Preprocessor.prototype.work = function(node) {
  if (node.type === "Seperator") {
    return node.val + node.space;
  } else {
    if (node in this.macroStack) {
      this.rt.raiseException("recursive macro detected");
    }
    this.macroStack.push(node);
    if (node.type === "Identifier") {
      return this.replaceMacro(node) + node.space;
    } else if (node.type === "PrepFunctionMacroCall") {
      return this.replaceMacroFunction(node);
    }
    this.macroStack.pop();
  }
};

Preprocessor.prototype.replaceMacro = function(id) {
  var i, rep, ret, v;
  if (this.isMacro(id)) {
    ret = "";
    rep = this.macros[id.val].replacement;
    i = 0;
    while (i < rep.length) {
      v = this.work(rep[i]);
      ret += v;
      i++;
    }
    return ret;
  } else {
    return id.val;
  }
};

Preprocessor.prototype.replaceMacroFunction = function(node) {
  var argi, args, argsText, i, j, name, rep, ret, v, x;
  if (this.isMacroFunction(node)) {
    name = node.Identifier.val;
    argsText = node.Args;
    rep = this.macros[name].replacement;
    args = this.macros[name].args;
    if (args.length === argsText.length) {
      ret = "";
      i = 0;
      while (i < rep.length) {
        if (rep[i].type === "Seperator") {
          v = this.work(rep[i]);
          ret += v;
        } else {
          argi = -1;
          j = 0;
          while (j < args.length) {
            if (rep[i].type === "Identifier" && args[j].val === rep[i].val) {
              argi = j;
              break;
            }
            j++;
          }
          if (argi >= 0) {
            v = "";
            j = 0;
            while (j < argsText[argi].length) {
              v += this.work(argsText[argi][j]);
              j++;
            }
            ret += v + rep[i].space;
          } else {
            v = this.work(rep[i]);
            ret += v;
          }
        }
        i++;
      }
      return ret;
    } else {
      this.rt.raiseException("macro " + name + " requires " + args.length + " arguments (" + argsText.length + " given)");
    }
  } else {
    argsText = node.Args;
    v = [];
    i = 0;
    while (i < argsText.length) {
      x = "";
      j = 0;
      while (j < argsText[i].length) {
        x += this.work(argsText[i][j]);
        j++;
      }
      v.push(x);
      i++;
    }
    return node.Identifier.val + "(" + v.join(",") + ")" + node.space;
  }
};

Preprocessor.prototype.parse = function(code) {
  var result;
  result = PEGUtil.parse(prepast, code);
  if (result.error != null) {
    throw new Error(JSON.stringify({text: "Preprocessor Error:\n" + PEGUtil.errorMessage(result.error, true), error: result.error}));
  }
  this.rt.interp = this;
  return this.visit(result.ast, code);
};

module.exports = {
  parse: function(rt, code) {
    return new Preprocessor(rt).parse(code);
  }
};

},{"./prepast":15,"pegjs-util":44}],17:[function(require,module,exports){
var CRuntime, Defaults,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  slice = [].slice;

Defaults = require("./defaults");

CRuntime = function(config) {
  var defaults, mergeConfig;
  mergeConfig = function(a, b) {
    var o;
    for (o in b) {
      if (o in a && typeof b[o] === "object") {
        mergeConfig(a[o], b[o]);
      } else {
        a[o] = b[o];
      }
    }
  };
  defaults = new Defaults();
  this.config = defaults.config;
  mergeConfig(this.config, config);
  this.numericTypeOrder = defaults.numericTypeOrder;
  this.types = defaults.types;
  this.intTypeLiteral = this.primitiveType("int");
  this.unsignedintTypeLiteral = this.primitiveType("unsigned int");
  this.longTypeLiteral = this.primitiveType("long");
  this.floatTypeLiteral = this.primitiveType("float");
  this.doubleTypeLiteral = this.primitiveType("double");
  this.charTypeLiteral = this.primitiveType("char");
  this.unsignedcharTypeLiteral = this.primitiveType("unsigned char");
  this.boolTypeLiteral = this.primitiveType("bool");
  this.voidTypeLiteral = this.primitiveType("void");
  this.nullPointerValue = this.makeNormalPointerValue(null);
  this.voidPointerType = this.normalPointerType(this.voidTypeLiteral);
  this.nullPointer = this.val(this.voidPointerType, this.nullPointerValue);
  this.scope = [
    {
      "$name": "global"
    }
  ];
  this.typedefs = {};
  return this;
};

CRuntime.prototype.include = function(name) {
  var includes, lib;
  includes = this.config.includes;
  if (name in includes) {
    lib = includes[name];
    if (indexOf.call(this.config.loadedLibraries, name) >= 0) {
      return;
    }
    this.config.loadedLibraries.push(name);
    includes[name].load(this);
  } else {
    this.raiseException("cannot find library: " + name);
  }
};

CRuntime.prototype.getSize = function(element) {
  var i, ret;
  ret = 0;
  if (this.isArrayType(element.t) && element.v.position === 0) {
    i = 0;
    while (i < element.v.target.length) {
      ret += this.getSize(element.v.target[i]);
      i++;
    }
  } else {
    ret += this.getSizeByType(element.t);
  }
  return ret;
};

CRuntime.prototype.getSizeByType = function(type) {
  if (this.isPointerType(type)) {
    return this.config.limits["pointer"].bytes;
  } else if (this.isPrimitiveType(type)) {
    return this.config.limits[type.name].bytes;
  } else {
    this.raiseException("not implemented");
  }
};

CRuntime.prototype.getMember = function(l, r) {
  var lt, ltsig, t;
  lt = l.t;
  if (this.isClassType(lt)) {
    ltsig = this.getTypeSignature(lt);
    if (ltsig in this.types) {
      t = this.types[ltsig];
      if (r in t) {
        return {
          t: {
            type: "function"
          },
          v: {
            defineType: lt,
            name: r,
            bindThis: l
          }
        };
      } else if (r in l.v.members) {
        return l.v.members[r];
      }
    } else {
      this.raiseException("type " + this.makeTypeString(lt) + " is unknown");
    }
  } else {
    this.raiseException("only a class can have members");
  }
};

CRuntime.prototype.defFunc = function(lt, name, retType, argTypes, argNames, stmts, interp) {
  var f, rt;
  rt = this;
  if (stmts != null) {
    f = function*() {
      var _this, args, ret, rt;
      rt = arguments[0], _this = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      rt.enterScope("function " + name);
      argNames.forEach(function(v, i) {
        rt.defVar(v, argTypes[i], args[i]);
      });
      ret = (yield* interp.run(stmts, {
        scope: "function"
      }));
      if (!rt.isTypeEqualTo(retType, rt.voidTypeLiteral)) {
        if (ret instanceof Array && ret[0] === "return") {
          ret = rt.cast(retType, ret[1]);
        } else {
          rt.raiseException("you must return a value");
        }
      } else {
        if (typeof ret === "Array") {
          if (ret[0] === "return" && ret[1]) {
            rt.raiseException("you cannot return a value of a void function");
          }
        }
        ret = void 0;
      }
      rt.exitScope("function " + name);
      return ret;
    };
    this.regFunc(f, lt, name, argTypes, retType);
  } else {
    this.regFuncPrototype(lt, name, argTypes, retType);
  }
};

CRuntime.prototype.makeParametersSignature = function(args) {
  var i, ret;
  ret = new Array(args.length);
  i = 0;
  while (i < args.length) {
    ret[i] = this.getTypeSignature(args[i]);
    i++;
  }
  return ret.join(",");
};

CRuntime.prototype.getCompatibleFunc = function(lt, name, args) {
  var argsStr, compatibles, ltsig, ret, rt, sig, t, ts;
  ltsig = this.getTypeSignature(lt);
  if (ltsig in this.types) {
    t = this.types[ltsig];
    if (name in t) {
      ts = args.map(function(v) {
        return v.t;
      });
      sig = this.makeParametersSignature(ts);
      if (sig in t[name]) {
        ret = t[name][sig];
      } else {
        compatibles = [];
        rt = this;
        t[name]["reg"].forEach(function(dts) {
          var i, newTs, ok;
          if (dts[dts.length - 1] === "?" && dts.length < ts.length) {
            newTs = ts.slice(0, dts.length - 1);
            dts = dts.slice(0, -1);
          } else {
            newTs = ts;
          }
          if (dts.length === newTs.length) {
            ok = true;
            i = 0;
            while (ok && i < newTs.length) {
              ok = rt.castable(newTs[i], dts[i]);
              i++;
            }
            if (ok) {
              compatibles.push(t[name][rt.makeParametersSignature(dts)]);
            }
          }
        });
        if (compatibles.length === 0) {
          if ("#default" in t[name]) {
            ret = t[name]["#default"];
          } else {
            rt = this;
            argsStr = ts.map(function(v) {
              return rt.makeTypeString(v);
            }).join(",");
            this.raiseException("no method " + name + " in " + lt + " accepts " + argsStr);
          }
        } else if (compatibles.length > 1) {
          this.raiseException("ambiguous method invoking, " + compatibles.length + " compatible methods");
        } else {
          ret = compatibles[0];
        }
      }
    } else {
      this.raiseException("method " + name + " is not defined in " + this.makeTypeString(lt));
    }
  } else {
    this.raiseException("type " + this.makeTypeString(lt) + " is unknown");
  }
  if (ret == null) {
    this.raiseException("method " + name + " does not seem to be implemented");
  }
  return ret;
};

CRuntime.prototype.matchVarArg = function(methods, sig) {
  var _sig;
  for (_sig in methods) {
    if (_sig[_sig.length - 1] === "?") {
      _sig = _sig.slice(0, -1);
      if (sig.startsWith(_sig)) {
        return methods[_sig];
      }
    }
  }
  return null;
};

CRuntime.prototype.getFunc = function(lt, name, args) {
  var f, ltsig, method, sig, t;
  method = void 0;
  if (this.isPointerType(lt) || this.isFunctionType(lt)) {
    f = void 0;
    if (this.isArrayType(lt)) {
      f = "pointer_array";
    } else if (this.isFunctionType(lt)) {
      f = "function";
    } else {
      f = "pointer_normal";
    }
    t = null;
    if (name in this.types[f]) {
      t = this.types[f];
    } else if (name in this.types["pointer"]) {
      t = this.types["pointer"];
    }
    if (t) {
      sig = this.makeParametersSignature(args);
      if (sig in t[name]) {
        return t[name][sig];
      } else if ((method = this.matchVarArg(t[name], sig)) !== null) {
        return method;
      } else if ("#default" in t[name]) {
        return t[name]["#default"];
      } else {
        this.raiseException("no method " + name + " in " + this.makeTypeString(lt) + " accepts (" + sig + ")");
      }
    }
  }
  ltsig = this.getTypeSignature(lt);
  if (ltsig in this.types) {
    t = this.types[ltsig];
    if (name in t) {
      sig = this.makeParametersSignature(args);
      if (sig in t[name]) {
        return t[name][sig];
      } else if ((method = this.matchVarArg(t[name], sig)) !== null) {
        return method;
      } else if ("#default" in t[name]) {
        return t[name]["#default"];
      } else {
        this.raiseException("no method " + name + " in " + this.makeTypeString(lt) + " accepts (" + sig + ")");
      }
    } else {
      this.raiseException("method " + name + " is not defined in " + this.makeTypeString(lt));
    }
  } else {
    if (this.isPointerType(lt)) {
      this.raiseException("this pointer has no proper method overload");
    } else {
      this.raiseException("type " + this.makeTypeString(lt) + " is not defined");
    }
  }
};

CRuntime.prototype.makeOperatorFuncName = function(name) {
  return "o(" + name + ")";
};

CRuntime.prototype.regOperator = function(f, lt, name, args, retType) {
  return this.regFunc(f, lt, this.makeOperatorFuncName(name), args, retType);
};

CRuntime.prototype.regFuncPrototype = function(lt, name, args, retType) {
  var ltsig, sig, t, type;
  ltsig = this.getTypeSignature(lt);
  if (ltsig in this.types) {
    t = this.types[ltsig];
    if (!(name in t)) {
      t[name] = {};
    }
    if (!("reg" in t[name])) {
      t[name]["reg"] = [];
    }
    sig = this.makeParametersSignature(args);
    if (sig in t[name]) {
      this.raiseException("method " + name + " with parameters (" + sig + ") is already defined");
    }
    type = this.functionType(retType, args);
    if (lt === "global") {
      this.defVar(name, type, this.val(type, this.makeFunctionPointerValue(null, name, lt, args, retType)));
    }
    t[name][sig] = null;
    t[name]["reg"].push(args);
  } else {
    this.raiseException("type " + this.makeTypeString(lt) + " is unknown");
  }
};

CRuntime.prototype.regFunc = function(f, lt, name, args, retType) {
  var func, ltsig, sig, t, type;
  ltsig = this.getTypeSignature(lt);
  if (ltsig in this.types) {
    t = this.types[ltsig];
    if (!(name in t)) {
      t[name] = {};
    }
    if (!("reg" in t[name])) {
      t[name]["reg"] = [];
    }
    sig = this.makeParametersSignature(args);
    if (sig in t[name] && (t[name][sig] != null)) {
      this.raiseException("method " + name + " with parameters (" + sig + ") is already defined");
    }
    type = this.functionType(retType, args);
    if (lt === "global") {
      if (this.varAlreadyDefined(name)) {
        func = this.scope[0][name];
        if (func.v.target !== null) {
          this.raiseException("global method " + name + " with parameters (" + sig + ") is already defined");
        } else {
          func.v.target = f;
        }
      } else {
        this.defVar(name, type, this.val(type, this.makeFunctionPointerValue(f, name, lt, args, retType)));
      }
    }
    t[name][sig] = f;
    t[name]["reg"].push(args);
  } else {
    this.raiseException("type " + this.makeTypeString(lt) + " is unknown");
  }
};

CRuntime.prototype.registerTypedef = function(basttype, name) {
  return this.typedefs[name] = basttype;
};

CRuntime.prototype.promoteNumeric = function(l, r) {
  var rett, slt, slti, srt, srti;
  if (!this.isNumericType(l) || !this.isNumericType(r)) {
    this.raiseException("you cannot promote (to) a non numeric type");
  }
  if (this.isTypeEqualTo(l, r)) {
    if (this.isTypeEqualTo(l, this.boolTypeLiteral)) {
      return this.intTypeLiteral;
    }
    if (this.isTypeEqualTo(l, this.charTypeLiteral)) {
      return this.intTypeLiteral;
    }
    if (this.isTypeEqualTo(l, this.unsignedcharTypeLiteral)) {
      return this.unsignedintTypeLiteral;
    }
    return l;
  } else if (this.isIntegerType(l) && this.isIntegerType(r)) {
    slt = this.getSignedType(l);
    srt = this.getSignedType(r);
    if (this.isTypeEqualTo(slt, srt)) {
      rett = slt;
    } else {
      slti = this.numericTypeOrder.indexOf(slt.name);
      srti = this.numericTypeOrder.indexOf(srt.name);
      if (slti <= srti) {
        if (this.isUnsignedType(l) && this.isUnsignedType(r)) {
          rett = r;
        } else {
          rett = srt;
        }
      } else {
        if (this.isUnsignedType(l) && this.isUnsignedType(r)) {
          rett = l;
        } else {
          rett = slt;
        }
      }
    }
    return rett;
  } else if (!this.isIntegerType(l) && this.isIntegerType(r)) {
    return l;
  } else if (this.isIntegerType(l) && !this.isIntegerType(r)) {
    return r;
  } else if (!this.isIntegerType(l) && !this.isIntegerType(r)) {
    return this.primitiveType("double");
  }
};

CRuntime.prototype.readVar = function(varname) {
  var i, ret, vc;
  i = this.scope.length - 1;
  while (i >= 0) {
    vc = this.scope[i];
    if (vc[varname]) {
      ret = vc[varname];
      return ret;
    }
    i--;
  }
  this.raiseException("variable " + varname + " does not exist");
};

CRuntime.prototype.varAlreadyDefined = function(varname) {
  var vc;
  vc = this.scope[this.scope.length - 1];
  return varname in vc;
};

CRuntime.prototype.defVar = function(varname, type, initval) {
  var vc;
  if (this.varAlreadyDefined(varname)) {
    this.raiseException("variable " + varname + " already defined");
  }
  vc = this.scope[this.scope.length - 1];
  initval = this.clone(this.cast(type, initval));
  if (initval === void 0) {
    vc[varname] = this.defaultValue(type);
    vc[varname].left = true;
  } else {
    vc[varname] = initval;
    vc[varname].left = true;
  }
};

CRuntime.prototype.inrange = function(type, value) {
  var limit;
  if (this.isPrimitiveType(type)) {
    limit = this.config.limits[type.name];
    return value <= limit.max && value >= limit.min;
  } else {
    return true;
  }
};

CRuntime.prototype.isNumericType = function(type) {
  return this.isFloatType(type) || this.isIntegerType(type);
};

CRuntime.prototype.isUnsignedType = function(type) {
  if (typeof type === "string") {
    switch (type) {
      case "unsigned char":
      case "unsigned short":
      case "unsigned short int":
      case "unsigned":
      case "unsigned int":
      case "unsigned long":
      case "unsigned long int":
      case "unsigned long long":
      case "unsigned long long int":
        return true;
      default:
        return false;
    }
  } else {
    return type.type === "primitive" && this.isUnsignedType(type.name);
  }
};

CRuntime.prototype.isIntegerType = function(type) {
  if (typeof type === "string") {
    return indexOf.call(this.config.charTypes, type) >= 0 || indexOf.call(this.config.intTypes, type) >= 0;
  } else {
    return type.type === "primitive" && this.isIntegerType(type.name);
  }
};

CRuntime.prototype.isFloatType = function(type) {
  if (typeof type === "string") {
    switch (type) {
      case "float":
      case "double":
        return true;
      default:
        return false;
    }
  } else {
    return type.type === "primitive" && this.isFloatType(type.name);
  }
};

CRuntime.prototype.getSignedType = function(type) {
  if (type !== "unsigned") {
    return this.primitiveType(type.name.replace("unsigned", "").trim());
  } else {
    return this.primitiveType("int");
  }
};

CRuntime.prototype.castable = function(type1, type2) {
  if (this.isTypeEqualTo(type1, type2)) {
    return true;
  }
  if (this.isPrimitiveType(type1) && this.isPrimitiveType(type2)) {
    return this.isNumericType(type2) && this.isNumericType(type1);
  } else if (this.isPointerType(type1) && this.isPointerType(type2)) {
    if (this.isFunctionType(type1)) {
      return this.isPointerType(type2);
    }
    return !this.isFunctionType(type2);
  } else if (this.isClassType(type1) || this.isClassType(type2)) {
    this.raiseException("not implemented");
  }
  return false;
};

CRuntime.prototype.cast = function(type, value) {
  var bytes, newValue, ref, v;
  if (this.isTypeEqualTo(value.t, type)) {
    return value;
  }
  if (this.isPrimitiveType(type) && this.isPrimitiveType(value.t)) {
    if (type.name === "bool") {
      return this.val(type, value.v ? 1 : 0);
    } else if ((ref = type.name) === "float" || ref === "double") {
      if (!this.isNumericType(value.t)) {
        this.raiseException("cannot cast " + this.makeTypeString(value.t) + " to " + this.makeTypeString(type));
      }
      if (this.inrange(type, value.v)) {
        return this.val(type, value.v);
      } else {
        this.raiseException("overflow when casting " + this.makeTypeString(value.t) + " to " + this.makeTypeString(type));
      }
    } else {
      if (type.name.slice(0, 8) === "unsigned") {
        if (!this.isNumericType(value.t)) {
          this.raiseException("cannot cast " + this.makeTypeString(value.t) + " to " + this.makeTypeString(type));
        } else if (value.v < 0) {
          bytes = this.config.limits[type.name].bytes;
          newValue = value.v & ((1 << 8 * bytes) - 1);
          if (!this.inrange(type, newValue)) {
            this.raiseException(("cannot cast negative value " + newValue + " to ") + this.makeTypeString(type));
          } else {
            return this.val(type, newValue);
          }
        }
      }
      if (!this.isNumericType(value.t)) {
        this.raiseException("cannot cast " + this.makeTypeString(value.t) + " to " + this.makeTypeString(type));
      }
      if (value.t.name === "float" || value.t.name === "double") {
        v = value.v > 0 ? Math.floor(value.v) : Math.ceil(value.v);
        if (this.inrange(type, v)) {
          return this.val(type, v);
        } else {
          this.raiseException("overflow when casting " + this.makeValString(value) + " to " + this.makeTypeString(type));
        }
      } else {
        if (this.inrange(type, value.v)) {
          return this.val(type, value.v);
        } else {
          this.raiseException("overflow when casting " + this.makeValString(value) + " to " + this.makeTypeString(type));
        }
      }
    }
  } else if (this.isPointerType(type)) {
    if (this.isFunctionType(type)) {
      if (this.isFunctionType(value.t)) {
        return this.val(value.t, value.v);
      } else {
        this.raiseException("cannot cast a regular pointer to a function");
      }
    } else if (this.isArrayType(value.t)) {
      if (this.isNormalPointerType(type)) {
        if (this.isTypeEqualTo(type.targetType, value.t.eleType)) {
          return value;
        } else {
          this.raiseException(this.makeTypeString(type.targetType) + " is not equal to array element type " + this.makeTypeString(value.t.eleType));
        }
      } else if (this.isArrayType(type)) {
        if (this.isTypeEqualTo(type.eleType, value.t.eleType)) {
          return value;
        } else {
          this.raiseException("array element type " + this.makeTypeString(type.eleType) + " is not equal to array element type " + this.makeTypeString(value.t.eleType));
        }
      } else {
        this.raiseException("cannot cast a function to a regular pointer");
      }
    } else {
      if (this.isNormalPointerType(type)) {
        if (this.isTypeEqualTo(type.targetType, value.t.targetType)) {
          return value;
        } else {
          this.raiseException(this.makeTypeString(type.targetType) + " is not equal to " + this.makeTypeString(value.t.eleType));
        }
      } else if (this.isArrayType(type)) {
        if (this.isTypeEqualTo(type.eleType, value.t.targetType)) {
          return value;
        } else {
          this.raiseException("array element type " + this.makeTypeString(type.eleType) + " is not equal to " + this.makeTypeString(value.t.eleType));
        }
      } else {
        this.raiseException("cannot cast a function to a regular pointer");
      }
    }
  } else if (this.isClassType(type)) {
    this.raiseException("not implemented");
  } else if (this.isClassType(value.t)) {
    value = this.getCompatibleFunc(value.t, this.makeOperatorFuncName(type.name), [])(this, value);
    return value;
  } else {
    this.raiseException("cast failed from type " + this.makeTypeString(type) + " to " + this.makeTypeString(value.t));
  }
};

CRuntime.prototype.clone = function(v) {
  return this.val(v.t, v.v);
};

CRuntime.prototype.enterScope = function(scopename) {
  this.scope.push({
    "$name": scopename
  });
};

CRuntime.prototype.exitScope = function(scopename) {
  var s;
  while (true) {
    s = this.scope.pop();
    if (!(scopename && this.scope.length > 1 && s["$name"] !== scopename)) {
      break;
    }
  }
};

CRuntime.prototype.val = function(type, v, left) {
  if (this.isNumericType(type) && !this.inrange(type, v)) {
    this.raiseException("overflow of " + (this.makeValString({
      t: type,
      v: v
    })));
  }
  if (left === void 0) {
    left = false;
  }
  return {
    "t": type,
    "v": v,
    "left": left
  };
};

CRuntime.prototype.isTypeEqualTo = function(type1, type2) {
  var _this;
  if (type1.type === type2.type) {
    switch (type1.type) {
      case "primitive":
      case "class":
        return type1.name === type2.name;
      case "pointer":
        if (type1.ptrType === type2.ptrType || type1.ptrType !== "function" && type2.ptrType !== "function") {
          switch (type1.ptrType) {
            case "array":
              return this.isTypeEqualTo(type1.eleType, type2.eleType || type2.targetType);
            case "function":
              return this.isTypeEqualTo(type1.funcType, type2.funcType);
            case "normal":
              return this.isTypeEqualTo(type1.targetType, type2.eleType || type2.targetType);
          }
        }
        break;
      case "function":
        if (this.isTypeEqualTo(type1.retType, type2.retType) && type1.signature.length === type2.signature.length) {
          _this = this;
          return type1.signature.every(function(type, index, arr) {
            return _this.isTypeEqualTo(type, type2.signature[index]);
          });
        }
    }
  }
  return false;
};

CRuntime.prototype.isBoolType = function(type) {
  if (typeof type === "string") {
    return type === "bool";
  } else {
    return type.type === "primitive" && this.isBoolType(type.name);
  }
};

CRuntime.prototype.isVoidType = function(type) {
  if (typeof type === "string") {
    return type === "void";
  } else {
    return type.type === "primitive" && this.isVoidType(type.name);
  }
};

CRuntime.prototype.isPrimitiveType = function(type) {
  return this.isNumericType(type) || this.isBoolType(type) || this.isVoidType(type);
};

CRuntime.prototype.isArrayType = function(type) {
  return this.isPointerType(type) && type.ptrType === "array";
};

CRuntime.prototype.isFunctionType = function(type) {
  return type.type === "function" || this.isNormalPointerType(type) && this.isFunctionType(type.targetType);
};

CRuntime.prototype.isNormalPointerType = function(type) {
  return this.isPointerType(type) && type.ptrType === "normal";
};

CRuntime.prototype.isPointerType = function(type) {
  return type.type === "pointer";
};

CRuntime.prototype.isClassType = function(type) {
  return type.type === "class";
};

CRuntime.prototype.arrayPointerType = function(eleType, size) {
  return {
    type: "pointer",
    ptrType: "array",
    eleType: eleType,
    size: size
  };
};

CRuntime.prototype.makeArrayPointerValue = function(arr, position) {
  return {
    target: arr,
    position: position
  };
};

CRuntime.prototype.functionPointerType = function(retType, signature) {
  return this.normalPointerType(this.functionType(retType, signature));
};

CRuntime.prototype.functionType = function(retType, signature) {
  return {
    type: "function",
    retType: retType,
    signature: signature
  };
};

CRuntime.prototype.makeFunctionPointerValue = function(f, name, lt, args, retType) {
  return {
    target: f,
    name: name,
    defineType: lt,
    args: args,
    retType: retType
  };
};

CRuntime.prototype.normalPointerType = function(targetType) {
  return {
    type: "pointer",
    ptrType: "normal",
    targetType: targetType
  };
};

CRuntime.prototype.makeNormalPointerValue = function(target) {
  return {
    target: target
  };
};

CRuntime.prototype.simpleType = function(type) {
  var clsType, typeStr;
  if (Array.isArray(type)) {
    if (type.length > 1) {
      typeStr = type.filter((function(_this) {
        return function(t) {
          return indexOf.call(_this.config.specifiers, t) < 0;
        };
      })(this)).join(" ");
      return this.simpleType(typeStr);
    } else {
      return this.typedefs[type[0]] || this.simpleType(type[0]);
    }
  } else {
    if (this.isPrimitiveType(type)) {
      return this.primitiveType(type);
    } else {
      clsType = {
        type: "class",
        name: type
      };
      if (this.getTypeSignature(clsType) in this.types) {
        return clsType;
      } else {
        this.raiseException("type " + this.makeTypeString(type) + " is not defined");
      }
    }
  }
};

CRuntime.prototype.newClass = function(classname, members) {
  var clsType, sig;
  clsType = {
    type: "class",
    name: classname
  };
  sig = this.getTypeSignature(clsType);
  if (sig in this.types) {
    this.raiseException(this.makeTypeString(clsType) + " is already defined");
  }
  this.types[sig] = {
    "#constructor": function(rt, _this, initMembers) {
      var i, member;
      _this.v.members = {};
      i = 0;
      while (i < members.length) {
        member = members[i];
        _this.v.members[member.name] = initMembers[member.name];
        i++;
      }
    }
  };
  return clsType;
};

CRuntime.prototype.primitiveType = function(type) {
  return {
    type: "primitive",
    name: type
  };
};

CRuntime.prototype.isCharType = function(type) {
  return this.config.charTypes.indexOf(type.name) !== -1;
};

CRuntime.prototype.isStringType = function(type) {
  return this.isArrayType(type) && this.isCharType(type.eleType);
};

CRuntime.prototype.getStringFromCharArray = function(element) {
  var charVal, i, result, target;
  if (this.isStringType(element.t)) {
    target = element.v.target;
    result = "";
    i = 0;
    while (i < target.length) {
      charVal = target[i];
      if (charVal.v === 0) {
        break;
      }
      result += String.fromCharCode(charVal.v);
      i++;
    }
    return result;
  } else {
    this.raiseException("target is not a string");
  }
};

CRuntime.prototype.makeCharArrayFromString = function(str, typename) {
  var charType, self, trailingZero, type;
  self = this;
  typename || (typename = "char");
  charType = this.primitiveType(typename);
  type = this.arrayPointerType(charType, str.length + 1);
  trailingZero = this.val(charType, 0);
  return this.val(type, {
    target: str.split("").map(function(c) {
      return self.val(charType, c.charCodeAt(0));
    }).concat([trailingZero]),
    position: 0
  });
};

CRuntime.prototype.getTypeSignature = function(type) {
  var ret, self;
  ret = type;
  self = this;
  if (type.type === "primitive") {
    ret = "(" + type.name + ")";
  } else if (type.type === "class") {
    ret = "[" + type.name + "]";
  } else if (type.type === "pointer") {
    ret = "{";
    if (type.ptrType === "normal") {
      ret += "!" + this.getTypeSignature(type.targetType);
    } else if (type.ptrType === "array") {
      ret += "!" + this.getTypeSignature(type.eleType);
    }
    ret += "}";
  } else if (type.type === "function") {
    ret = "#" + this.getTypeSignature(type.retType) + "!" + type.signature.map((function(_this) {
      return function(e) {
        return _this.getTypeSignature(e);
      };
    })(this)).join(",");
  }
  return ret;
};

CRuntime.prototype.makeTypeString = function(type) {
  var ret;
  ret = "$" + type;
  if (type.type === "primitive") {
    ret = type.name;
  } else if (type.type === "class") {
    ret = type.name;
  } else if (type.type === "pointer") {
    ret = "";
    if (type.ptrType === "normal") {
      ret += this.makeTypeString(type.targetType) + "*";
    } else if (type.ptrType === "array") {
      ret += this.makeTypeString(type.eleType) + ("[" + type.size + "]");
    } else if (type.ptrType === "function") {
      ret += this.makeTypeString(type.retType) + "(*f)" + "(" + type.signature.map((function(_this) {
        return function(e) {
          return _this.makeTypeString(e);
        };
      })(this)).join(",") + ")";
    }
  }
  return ret;
};

CRuntime.prototype.makeValueString = function(l, options) {
  var display, i, j, ref, ref1;
  options || (options = {});
  if (this.isPrimitiveType(l.t)) {
    if (this.isTypeEqualTo(l.t, this.charTypeLiteral)) {
      display = "'" + String.fromCharCode(l.v) + "'";
    } else if (this.isBoolType(l.t)) {
      display = l.v !== 0 ? "true" : "false";
    } else {
      display = l.v;
    }
  } else if (this.isPointerType(l.t)) {
    if (this.isFunctionType(l.t)) {
      display = "<function>";
    } else if (this.isArrayType(l.t)) {
      if (this.isTypeEqualTo(l.t.eleType, this.charTypeLiteral)) {
        display = "\"" + this.getStringFromCharArray(l) + "\"";
      } else if (options.noArray) {
        display = "[...]";
      } else {
        options.noArray = true;
        display = [];
        for (i = j = ref = l.v.position, ref1 = l.v.target.length; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
          display.push(this.makeValueString(l.v.target[i], options));
        }
        display = "[" + display.join(",") + "]";
      }
    } else if (this.isNormalPointerType(l.t)) {
      if (options.noPointer) {
        display = "->?";
      } else {
        options.noPointer = true;
        display = "->" + this.makeValueString(l.v.target);
      }
    } else {
      this.raiseException("unknown pointer type");
    }
  } else if (this.isClassType(l.t)) {
    display = "<object>";
  }
  return display;
};

CRuntime.prototype.makeValString = function(l) {
  return this.makeValueString(l) + "(" + this.makeTypeString(l.t) + ")";
};

CRuntime.prototype.defaultValue = function(type, left) {
  var i, init, j, ref;
  if (type.type === "primitive") {
    if (this.isNumericType(type)) {
      return this.val(type, 0, left);
    }
  } else if (type.type === "class") {
    this.raiseException("no default value for object");
  } else if (type.type === "pointer") {
    if (type.ptrType === "normal") {
      return this.val(type, this.nullPointerValue, left);
    } else if (type.ptrType === "array") {
      init = [];
      for (i = j = 0, ref = type.size; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        init[i] = this.defaultValue(type.eleType, true);
      }
      return this.val(type, this.makeArrayPointerValue(init, 0), left);
    }
  }
};

CRuntime.prototype.raiseException = function(message) {
  var col, interp, ln, posInfo;
  interp = this.interp;
  if (interp) {
    ln = 0;
    col = 0;
    posInfo = interp.currentNode != null ? (ln = interp.currentNode.sLine, col = interp.currentNode.sColumn, ln + ":" + col) : "<position unavailable>";
    throw new Error(JSON.stringify({text: posInfo + " " + message, error: {line: ln, column: col}}));
  } else {
    throw new Error(JSON.stringify({text: message, error: {line: 0, col: 0}}));
  }
};

module.exports = CRuntime;

},{"./defaults":3}],18:[function(require,module,exports){

},{}],19:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

},{"base64-js":20,"ieee754":21,"is-array":22}],20:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],21:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],22:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],23:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],24:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],25:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],26:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],27:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":28}],28:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/



/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

},{"./_stream_readable":30,"./_stream_writable":32,"core-util-is":33,"inherits":24,"process-nextick-args":34}],29:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":31,"core-util-is":33,"inherits":24}],30:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/


/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/



/*<replacement>*/
var Stream;
(function (){try{
  Stream = require('st' + 'ream');
}catch(_){}finally{
  if (!Stream)
    Stream = require('events').EventEmitter;
}}())
/*</replacement>*/

var Buffer = require('buffer').Buffer;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/



/*<replacement>*/
var debug = require('util');
if (debug && debug.debuglog) {
  debug = debug.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  var Duplex = require('./_stream_duplex');

  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function')
    this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function() {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      if (!addToFront)
        state.reading = false;

      // if we want the data now, just emit it.
      if (state.flowing && state.length === 0 && !state.sync) {
        stream.emit('data', chunk);
        stream.read(0);
      } else {
        // update the buffer info.
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);

        if (state.needReadable)
          emitReadable(stream);
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else {
      return state.length;
    }
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  debug('read', n);
  var state = this._readableState;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended)
      endReadable(this);
    else
      emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  }

  if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read pushed data synchronously, then `reading` will be false,
  // and we need to re-evaluate how much data we can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we tried to read() past the EOF, then emit end on the next tick.
  if (nOrig !== n && state.ended && state.length === 0)
    endReadable(this);

  if (ret !== null)
    this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!(Buffer.isBuffer(chunk)) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      processNextTick(emitReadable_, stream);
    else
      emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    processNextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain &&
        (!dest._writableState || dest._writableState.needDrain))
      ondrain();
  }

  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    var ret = dest.write(chunk);
    if (false === ret) {
      debug('false write response, pause',
            src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  // If listening to data, and it has not explicitly been paused,
  // then call resume to start the flow of data on the next tick.
  if (ev === 'data' && false !== this._readableState.flowing) {
    this.resume();
  }

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}

Readable.prototype.pause = function() {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  if (state.flowing) {
    do {
      var chunk = stream.read();
    } while (null !== chunk && state.flowing);
  }
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    debug('wrapped data');
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }; }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"./_stream_duplex":28,"_process":26,"buffer":19,"core-util-is":33,"events":23,"inherits":24,"isarray":25,"process-nextick-args":34,"string_decoder/":41,"util":18}],31:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function')
      this._transform = options.transform;

    if (typeof options.flush === 'function')
      this._flush = options.flush;
  }

  this.once('prefinish', function() {
    if (typeof this._flush === 'function')
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":28,"core-util-is":33,"inherits":24}],32:[function(require,module,exports){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/



/*<replacement>*/
var Stream;
(function (){try{
  Stream = require('st' + 'ream');
}catch(_){}finally{
  if (!Stream)
    Stream = require('events').EventEmitter;
}}())
/*</replacement>*/

var Buffer = require('buffer').Buffer;

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  var Duplex = require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

WritableState.prototype.getBuffer = function writableStateGetBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function (){try {
Object.defineProperty(WritableState.prototype, 'buffer', {
  get: require('util-deprecate')(function() {
    return this.getBuffer();
  }, '_writableState.buffer is deprecated. Use ' +
      '_writableState.getBuffer() instead.')
});
}catch(_){}}());


function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function')
      this._write = options.write;

    if (typeof options.writev === 'function')
      this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;

  if (!(Buffer.isBuffer(chunk)) &&
      typeof chunk !== 'string' &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = nop;

  if (state.ended)
    writeAfterEnd(this, cb);
  else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function() {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function() {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing &&
        !state.corked &&
        !state.finished &&
        !state.bufferProcessing &&
        state.bufferedRequest)
      clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string')
    encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64',
'ucs2', 'ucs-2','utf16le', 'utf-16le', 'raw']
.indexOf((encoding + '').toLowerCase()) > -1))
    throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync)
    processNextTick(cb, er);
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished &&
        !state.corked &&
        !state.bufferProcessing &&
        state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      processNextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var buffer = [];
    var cbs = [];
    while (entry) {
      cbs.push(entry.callback);
      buffer.push(entry);
      entry = entry.next;
    }

    // count the one we are adding, as well.
    // TODO(isaacs) clean this up
    state.pendingcb++;
    state.lastBufferedRequest = null;
    doWrite(stream, state, true, state.length, buffer, '', function(err) {
      for (var i = 0; i < cbs.length; i++) {
        state.pendingcb--;
        cbs[i](err);
      }
    });

    // Clear buffer
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null)
      state.lastBufferedRequest = null;
  }
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined)
    this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(state) {
  return (state.ending &&
          state.length === 0 &&
          state.bufferedRequest === null &&
          !state.finished &&
          !state.writing);
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      processNextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"./_stream_duplex":28,"buffer":19,"core-util-is":33,"events":23,"inherits":24,"process-nextick-args":34,"util-deprecate":35}],33:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":19}],34:[function(require,module,exports){
(function (process){
'use strict';
module.exports = nextTick;

function nextTick(fn) {
  var args = new Array(arguments.length - 1);
  var i = 0;
  while (i < arguments.length) {
    args[i++] = arguments[i];
  }
  process.nextTick(function afterTick() {
    fn.apply(null, args);
  });
}

}).call(this,require('_process'))
},{"_process":26}],35:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  if (!global.localStorage) return false;
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],36:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":29}],37:[function(require,module,exports){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":28,"./lib/_stream_passthrough.js":29,"./lib/_stream_readable.js":30,"./lib/_stream_transform.js":31,"./lib/_stream_writable.js":32}],38:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":31}],39:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":32}],40:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":23,"inherits":24,"readable-stream/duplex.js":27,"readable-stream/passthrough.js":36,"readable-stream/readable.js":37,"readable-stream/transform.js":38,"readable-stream/writable.js":39}],41:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":19}],42:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],43:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":42,"_process":26,"inherits":24}],44:[function(require,module,exports){
(function (global){
/*
**  pegjs-util -- Utility Class for PEG.js
**  Copyright (c) 2014-2015 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  Universal Module Definition (UMD) for Library  */
(function (root, name, factory) {
    /* global define: false */
    /* global module: false */
    if (typeof define === "function" && typeof define.amd !== "undefined")
        /*  AMD environment  */
        define(name, function () { return factory(root); });
    else if (typeof module === "object" && typeof module.exports === "object")
        /*  CommonJS environment  */
        module.exports = factory(root);
    else
        /*  Browser environment  */
        root[name] = factory(root);
}(/* global global: false */
  (typeof global !== "undefined" ? global :
  /* global window: false */
  (typeof window !== "undefined" ? window : this)), "PEGUtil", function (/* root */) {

    var PEGUtil = {};

    /*  helper function for generating a function to generate an AST node  */
    PEGUtil.makeAST = function makeAST (line, column, offset, options) {
        return function () {
            return options.util.__makeAST.call(null, line(), column(), offset(), arguments);
        };
    };

    /*  helper function for generating a function to unroll the parse stack  */
    PEGUtil.makeUnroll = function (line, column, offset, SyntaxError) {
        return function (first, list, take) {
            if (   typeof list !== "object"
                || !(list instanceof Array))
                throw new SyntaxError("unroll: invalid list argument for unrolling",
                    (typeof list), "Array", offset(), line(), column());
            if (typeof take !== "undefined") {
                if (typeof take === "number")
                    take = [ take ];
                var result = [];
                if (first !== null)
                    result.push(first);
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < take.length; j++)
                        result.push(list[i][take[j]]);
                }
                return result;
            }
            else {
                if (first !== null)
                    list.unshift(first);
                return list;
            }
        };
    };

    /*  utility function: create a source excerpt  */
    var excerpt = function (txt, o) {
        var l = txt.length;
        var b = o - 20; if (b < 0) b = 0;
        var e = o + 20; if (e > l) e = l;
        var hex = function (ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        };
        var extract = function (txt, pos, len) {
            return txt.substr(pos, len)
                .replace(/\\/g,   "\\\\")
                .replace(/\x08/g, "\\b")
                .replace(/\t/g,   "\\t")
                .replace(/\n/g,   "\\n")
                .replace(/\f/g,   "\\f")
                .replace(/\r/g,   "\\r")
                .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return "\\x0" + hex(ch); })
                .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return "\\x"  + hex(ch); })
                .replace(/[\u0100-\u0FFF]/g,         function(ch) { return "\\u0" + hex(ch); })
                .replace(/[\u1000-\uFFFF]/g,         function(ch) { return "\\u"  + hex(ch); });
        };
        return {
            prolog: extract(txt, b, o - b),
            token:  extract(txt, o, 1),
            epilog: extract(txt, o + 1, e - (o + 1))
        };
    };

    /*  provide top-level parsing functionality  */
    PEGUtil.parse = function (parser, txt, options) {
        if (typeof parser !== "object")
            throw new Error("invalid parser object (not an object)");
        if (typeof parser.parse !== "function")
            throw new Error("invalid parser object (no \"parse\" function)");
        if (typeof txt !== "string")
            throw new Error("invalid input text (not a string)");
        if (typeof options !== "undefined" && typeof options !== "object")
            throw new Error("invalid options (not an object)");
        if (typeof options === "undefined")
            options = {};
        var result = { ast: null, error: null };
        try {
            var makeAST;
            if (typeof options.makeAST === "function")
                makeAST = options.makeAST;
            else {
                makeAST = function (line, column, offset, args) {
                    return { line: line, column: column, offset: offset, args: args };
                };
            }
            var opts = {
                util: {
                    makeUnroll: PEGUtil.makeUnroll,
                    makeAST:    PEGUtil.makeAST,
                    __makeAST:  makeAST
                }
            };
            if (typeof options.startRule === "string")
                opts.startRule = options.startRule;
            result.ast = parser.parse(txt, opts);
            result.error = null;
        }
        catch (e) {
            result.ast = null;
            var definedOrElse = function (value, fallback) {
                return (typeof value !== "undefined" ? value : fallback);
            };
            result.error = {
                line:     definedOrElse(e.line, definedOrElse(e.location.start.line, 0)),
                column:   definedOrElse(e.column, definedOrElse(e.location.start.column, 0)),
                message:  e.message,
                found:    definedOrElse(e.found, ""),
                expected: definedOrElse(e.expected, ""),
                location: excerpt(txt, definedOrElse(e.location.start.offset, 0))
            };
        }
        return result;
    };

    /*  render a useful error message  */
    PEGUtil.errorMessage = function (e, noFinalNewline) {/*
        var l = e.location;
        var prefix1 = "line " + e.line + " (column " + e.column + "): ";
        var prefix2 = "";
        for (var i = 0; i < prefix1.length + l.prolog.length; i++)
            prefix2 += "-";
        var msg = prefix1 + l.prolog + l.token + l.epilog + "\n" +
            prefix2 + "^" + "\n" +
            e.message + (noFinalNewline ? "" : "\n");
        return msg;*/
        return "line " + e.line + " (column " + e.column + "): " + e.message + (noFinalNewline ? "" : "\n");
    };

    return PEGUtil;
}));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],45:[function(require,module,exports){

var util = require('util');

var tokenize = function(/*String*/ str, /*RegExp*/ re, /*Function?*/ parseDelim, /*Object?*/ instance){
  // summary:
  //    Split a string by a regular expression with the ability to capture the delimeters
  // parseDelim:
  //    Each group (excluding the 0 group) is passed as a parameter. If the function returns
  //    a value, it's added to the list of tokens.
  // instance:
  //    Used as the "this' instance when calling parseDelim
  var tokens = [];
  var match, content, lastIndex = 0;
  while(match = re.exec(str)){
    content = str.slice(lastIndex, re.lastIndex - match[0].length);
    if(content.length){
      tokens.push(content);
    }
    if(parseDelim){
      var parsed = parseDelim.apply(instance, match.slice(1).concat(tokens.length));
      if(typeof parsed != 'undefined'){
        if(parsed.specifier === '%'){
          tokens.push('%');
        }else{
          tokens.push(parsed);
        }
      }
    }
    lastIndex = re.lastIndex;
  }
  content = str.slice(lastIndex);
  if(content.length){
    tokens.push(content);
  }
  return tokens;
}

var Formatter = function(/*String*/ format){
  var tokens = [];
  this._mapped = false;
  this._format = format;
  this._tokens = tokenize(format, this._re, this._parseDelim, this);
}

Formatter.prototype._re = /\%(?:\(([\w_]+)\)|([1-9]\d*)\$)?([0 +\-\#]*)(\*|\d+)?(\.)?(\*|\d+)?[hlL]?([\%bscdeEfFgGioOuxX])/g;
Formatter.prototype._parseDelim = function(mapping, intmapping, flags, minWidth, period, precision, specifier){
  if(mapping){
    this._mapped = true;
  }
  return {
    mapping: mapping,
    intmapping: intmapping,
    flags: flags,
    _minWidth: minWidth, // May be dependent on parameters
    period: period,
    _precision: precision, // May be dependent on parameters
    specifier: specifier
  };
};
Formatter.prototype._specifiers = {
  b: {
    base: 2,
    isInt: true
  },
  o: {
    base: 8,
    isInt: true
  },
  x: {
    base: 16,
    isInt: true
  },
  X: {
    extend: ['x'],
    toUpper: true
  },
  d: {
    base: 10,
    isInt: true
  },
  i: {
    extend: ['d']
  },
  u: {
    extend: ['d'],
    isUnsigned: true
  },
  c: {
    setArg: function(token){
      if(!isNaN(token.arg)){
        var num = parseInt(token.arg);
        if(num < 0 || num > 127){
          throw new Error('invalid character code passed to %c in printf');
        }
        token.arg = isNaN(num) ? '' + num : String.fromCharCode(num);
      }
    }
  },
  s: {
    setMaxWidth: function(token){
      token.maxWidth = (token.period == '.') ? token.precision : -1;
    }
  },
  e: {
    isDouble: true,
    doubleNotation: 'e'
  },
  E: {
    extend: ['e'],
    toUpper: true
  },
  f: {
    isDouble: true,
    doubleNotation: 'f'
  },
  F: {
    extend: ['f']
  },
  g: {
    isDouble: true,
    doubleNotation: 'g'
  },
  G: {
    extend: ['g'],
    toUpper: true
  },
  O: {
    isObject: true
  },
};
Formatter.prototype.format = function(/*mixed...*/ filler){
  if(this._mapped && typeof filler != 'object'){
    throw new Error('format requires a mapping');
  }

  var str = '';
  var position = 0;
  for(var i = 0, token; i < this._tokens.length; i++){
    token = this._tokens[i];
    
    if(typeof token == 'string'){
      str += token;
    }else{
      if(this._mapped){
        if(typeof filler[token.mapping] == 'undefined'){
          throw new Error('missing key ' + token.mapping);
        }
        token.arg = filler[token.mapping];
      }else{
        if(token.intmapping){
          position = parseInt(token.intmapping) - 1;
        }
        if(position >= arguments.length){
          throw new Error('got ' + arguments.length + ' printf arguments, insufficient for \'' + this._format + '\'');
        }
        token.arg = arguments[position++];
      }

      if(!token.compiled){
        token.compiled = true;
        token.sign = '';
        token.zeroPad = false;
        token.rightJustify = false;
        token.alternative = false;

        var flags = {};
        for(var fi = token.flags.length; fi--;){
          var flag = token.flags.charAt(fi);
          flags[flag] = true;
          switch(flag){
            case ' ':
              token.sign = ' ';
              break;
            case '+':
              token.sign = '+';
              break;
            case '0':
              token.zeroPad = (flags['-']) ? false : true;
              break;
            case '-':
              token.rightJustify = true;
              token.zeroPad = false;
              break;
            case '#':
              token.alternative = true;
              break;
            default:
              throw Error('bad formatting flag \'' + token.flags.charAt(fi) + '\'');
          }
        }

        token.minWidth = (token._minWidth) ? parseInt(token._minWidth) : 0;
        token.maxWidth = -1;
        token.toUpper = false;
        token.isUnsigned = false;
        token.isInt = false;
        token.isDouble = false;
        token.isObject = false;
        token.precision = 1;
        if(token.period == '.'){
          if(token._precision){
            token.precision = parseInt(token._precision);
          }else{
            token.precision = 0;
          }
        }

        var mixins = this._specifiers[token.specifier];
        if(typeof mixins == 'undefined'){
          throw new Error('unexpected specifier \'' + token.specifier + '\'');
        }
        if(mixins.extend){
          var s = this._specifiers[mixins.extend];
          for(var k in s){
            mixins[k] = s[k]
          }
          delete mixins.extend;
        }
        for(var l in mixins){
          token[l] = mixins[l];
        }
      }

      if(typeof token.setArg == 'function'){
        token.setArg(token);
      }

      if(typeof token.setMaxWidth == 'function'){
        token.setMaxWidth(token);
      }

      if(token._minWidth == '*'){
        if(this._mapped){
          throw new Error('* width not supported in mapped formats');
        }
        token.minWidth = parseInt(arguments[position++]);
        if(isNaN(token.minWidth)){
          throw new Error('the argument for * width at position ' + position + ' is not a number in ' + this._format);
        }
        // negative width means rightJustify
        if (token.minWidth < 0) {
          token.rightJustify = true;
          token.minWidth = -token.minWidth;
        }
      }

      if(token._precision == '*' && token.period == '.'){
        if(this._mapped){
          throw new Error('* precision not supported in mapped formats');
        }
        token.precision = parseInt(arguments[position++]);
        if(isNaN(token.precision)){
          throw Error('the argument for * precision at position ' + position + ' is not a number in ' + this._format);
        }
        // negative precision means unspecified
        if (token.precision < 0) {
          token.precision = 1;
          token.period = '';
        }
      }
      if(token.isInt){
        // a specified precision means no zero padding
        if(token.period == '.'){
          token.zeroPad = false;
        }
        this.formatInt(token);
      }else if(token.isDouble){
        if(token.period != '.'){
          token.precision = 6;
        }
        this.formatDouble(token); 
      }else if(token.isObject){
        this.formatObject(token);
      }
      this.fitField(token);

      str += '' + token.arg;
    }
  }

  return str;
};
Formatter.prototype._zeros10 = '0000000000';
Formatter.prototype._spaces10 = '          ';
Formatter.prototype.formatInt = function(token) {
  var i = parseInt(token.arg);
  if(!isFinite(i)){ // isNaN(f) || f == Number.POSITIVE_INFINITY || f == Number.NEGATIVE_INFINITY)
    // allow this only if arg is number
    if(typeof token.arg != 'number'){
      throw new Error('format argument \'' + token.arg + '\' not an integer; parseInt returned ' + i);
    }
    //return '' + i;
    i = 0;
  }

  // if not base 10, make negatives be positive
  // otherwise, (-10).toString(16) is '-a' instead of 'fffffff6'
  if(i < 0 && (token.isUnsigned || token.base != 10)){
    i = 0xffffffff + i + 1;
  } 

  if(i < 0){
    token.arg = (- i).toString(token.base);
    this.zeroPad(token);
    token.arg = '-' + token.arg;
  }else{
    token.arg = i.toString(token.base);
    // need to make sure that argument 0 with precision==0 is formatted as ''
    if(!i && !token.precision){
      token.arg = '';
    }else{
      this.zeroPad(token);
    }
    if(token.sign){
      token.arg = token.sign + token.arg;
    }
  }
  if(token.base == 16){
    if(token.alternative){
      token.arg = '0x' + token.arg;
    }
    token.arg = token.toUpper ? token.arg.toUpperCase() : token.arg.toLowerCase();
  }
  if(token.base == 8){
    if(token.alternative && token.arg.charAt(0) != '0'){
      token.arg = '0' + token.arg;
    }
  }
};
Formatter.prototype.formatDouble = function(token) {
  var f = parseFloat(token.arg);
  if(!isFinite(f)){ // isNaN(f) || f == Number.POSITIVE_INFINITY || f == Number.NEGATIVE_INFINITY)
    // allow this only if arg is number
    if(typeof token.arg != 'number'){
      throw new Error('format argument \'' + token.arg + '\' not a float; parseFloat returned ' + f);
    }
    // C99 says that for 'f':
    //   infinity -> '[-]inf' or '[-]infinity' ('[-]INF' or '[-]INFINITY' for 'F')
    //   NaN -> a string  starting with 'nan' ('NAN' for 'F')
    // this is not commonly implemented though.
    //return '' + f;
    f = 0;
  }

  switch(token.doubleNotation) {
    case 'e': {
      token.arg = f.toExponential(token.precision); 
      break;
    }
    case 'f': {
      token.arg = f.toFixed(token.precision); 
      break;
    }
    case 'g': {
      // C says use 'e' notation if exponent is < -4 or is >= prec
      // ECMAScript for toPrecision says use exponential notation if exponent is >= prec,
      // though step 17 of toPrecision indicates a test for < -6 to force exponential.
      if(Math.abs(f) < 0.0001){
        //print('forcing exponential notation for f=' + f);
        token.arg = f.toExponential(token.precision > 0 ? token.precision - 1 : token.precision);
      }else{
        token.arg = f.toPrecision(token.precision); 
      }

      // In C, unlike 'f', 'gG' removes trailing 0s from fractional part, unless alternative format flag ('#').
      // But ECMAScript formats toPrecision as 0.00100000. So remove trailing 0s.
      if(!token.alternative){ 
        //print('replacing trailing 0 in \'' + s + '\'');
        token.arg = token.arg.replace(/(\..*[^0])0*e/, '$1e');
        // if fractional part is entirely 0, remove it and decimal point
        token.arg = token.arg.replace(/\.0*e/, 'e').replace(/\.0$/,'');
      }
      break;
    }
    default: throw new Error('unexpected double notation \'' + token.doubleNotation + '\'');
  }

  // C says that exponent must have at least two digits.
  // But ECMAScript does not; toExponential results in things like '1.000000e-8' and '1.000000e+8'.
  // Note that s.replace(/e([\+\-])(\d)/, 'e$10$2') won't work because of the '$10' instead of '$1'.
  // And replace(re, func) isn't supported on IE50 or Safari1.
  token.arg = token.arg.replace(/e\+(\d)$/, 'e+0$1').replace(/e\-(\d)$/, 'e-0$1');

  // if alt, ensure a decimal point
  if(token.alternative){
    token.arg = token.arg.replace(/^(\d+)$/,'$1.');
    token.arg = token.arg.replace(/^(\d+)e/,'$1.e');
  }

  if(f >= 0 && token.sign){
    token.arg = token.sign + token.arg;
  }

  token.arg = token.toUpper ? token.arg.toUpperCase() : token.arg.toLowerCase();
};
Formatter.prototype.formatObject = function(token) {
  // If no precision is specified, then reset it to null (infinite depth).
  var precision = (token.period === '.') ? token.precision : null;
  token.arg = util.inspect(token.arg, !token.alternative, precision);
};
Formatter.prototype.zeroPad = function(token, /*Int*/ length) {
  length = (arguments.length == 2) ? length : token.precision;
  var negative = false;
  if(typeof token.arg != "string"){
    token.arg = "" + token.arg;
  }
  if (token.arg.substr(0,1) === '-') {
    negative = true;
    token.arg = token.arg.substr(1);
  }

  var tenless = length - 10;
  while(token.arg.length < tenless){
    token.arg = (token.rightJustify) ? token.arg + this._zeros10 : this._zeros10 + token.arg;
  }
  var pad = length - token.arg.length;
  token.arg = (token.rightJustify) ? token.arg + this._zeros10.substring(0, pad) : this._zeros10.substring(0, pad) + token.arg;
  if (negative) token.arg = '-' + token.arg;
};
Formatter.prototype.fitField = function(token) {
  if(token.maxWidth >= 0 && token.arg.length > token.maxWidth){
    return token.arg.substring(0, token.maxWidth);
  }
  if(token.zeroPad){
    this.zeroPad(token, token.minWidth);
    return;
  }
  this.spacePad(token);
};
Formatter.prototype.spacePad = function(token, /*Int*/ length) {
  length = (arguments.length == 2) ? length : token.minWidth;
  if(typeof token.arg != 'string'){
    token.arg = '' + token.arg;
  }
  var tenless = length - 10;
  while(token.arg.length < tenless){
    token.arg = (token.rightJustify) ? token.arg + this._spaces10 : this._spaces10 + token.arg;
  }
  var pad = length - token.arg.length;
  token.arg = (token.rightJustify) ? token.arg + this._spaces10.substring(0, pad) : this._spaces10.substring(0, pad) + token.arg;
};


module.exports = function(){
  var args = Array.prototype.slice.call(arguments),
    stream, format;
  if(args[0] instanceof require('stream').Stream){
    stream = args.shift();
  }
  format = args.shift();
  var formatter = new Formatter(format);
  var string = formatter.format.apply(formatter, args);
  if(stream){
    stream.write(string);
  }else{
    return string;
  }
};

module.exports.Formatter = Formatter;


},{"stream":40,"util":43}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);
