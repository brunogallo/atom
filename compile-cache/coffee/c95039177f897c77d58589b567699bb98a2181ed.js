
/* global
atom
describe xdescribe beforeEach it runs expect waitsForPromise
 */

(function() {
  var path;

  path = require('path');

  describe("QolorView", function() {
    var markerCheck;
    beforeEach(function() {
      return atom.project.setPaths([path.join(__dirname, 'fixtures')]);
    });
    markerCheck = function(fileName, marker, onlyOne) {
      var editor;
      if (onlyOne == null) {
        onlyOne = false;
      }
      editor = [];
      waitsForPromise(function() {
        return atom.workspace.open(fileName);
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-sql');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('qolor');
      });
      return runs(function() {
        var grammar, markers, name;
        editor = atom.workspace.getActiveTextEditor();
        grammar = atom.grammars.grammarForScopeName('source.sql');
        editor.setGrammar(grammar);
        markers = editor.findMarkers({
          type: 'qolor'
        });
        name = markers[marker.index].getBufferRange();
        expect(name.start.row).toBe(marker.start.row);
        expect(name.start.column).toBe(marker.start.column);
        expect(name.end.row).toBe(marker.end.row);
        expect(name.end.column).toBe(marker.end.column);
        if (onlyOne) {
          return expect(markers.length).toBe(1);
        }
      });
    };
    describe('opening a non sql file', function() {
      return it('should not remove decorations on qolored sql', function() {
        var editor;
        editor = [];
        waitsForPromise(function() {
          return atom.workspace.open('schema-base-case.sql');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-sql');
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('qolor');
        });
        waitsForPromise(function() {
          return atom.workspace.open('_not-sql.md');
        });
        waitsForPromise(function() {
          return atom.workspace.open('schema-base-case.sql');
        });
        return runs(function() {
          var grammar, markers, name;
          editor = atom.workspace.getActiveTextEditor();
          grammar = atom.grammars.grammarForScopeName('source.sql');
          editor.setGrammar(grammar);
          markers = editor.findMarkers({
            type: 'qolor'
          });
          name = markers[0].getBufferRange();
          expect(name.start.row).toBe(0);
          expect(name.start.column).toBe(7);
          expect(name.end.row).toBe(0);
          return expect(name.end.column).toBe(10);
        });
      });
    });
    describe('from statement', function() {
      describe('base case', function() {
        return it('has marker @ "test t"', function() {
          return markerCheck('from-statement-base-case.sql', {
            index: 0,
            start: {
              row: 0,
              column: 14
            },
            end: {
              row: 0,
              column: 20
            }
          });
        });
      });
      describe('alias in where clause', function() {
        it('has marker @ "test t" despite casing in select statement', function() {
          return markerCheck('from-statement-with-alias.sql', {
            index: 0,
            start: {
              row: 0,
              column: 14
            },
            end: {
              row: 0,
              column: 20
            }
          });
        });
        return it('has marker for alias (lhs) "t"', function() {
          return markerCheck('from-statement-with-alias.sql', {
            index: 1,
            start: {
              row: 0,
              column: 27
            },
            end: {
              row: 0,
              column: 28
            }
          });
        });
      });
      return describe('no trailing space', function() {
        return it('has marker @ "test t"', function() {
          return markerCheck('from-statement-with-nothing-after.sql', {
            index: 0,
            start: {
              row: 0,
              column: 14
            },
            end: {
              row: 0,
              column: 20
            }
          });
        });
      });
    });
    describe('ignores newlines', function() {
      it('has marker @ "newlines n" despite whitespace', function() {
        return markerCheck('newlines-and-spacing.sql', {
          index: 0,
          start: {
            row: 3,
            column: 4
          },
          end: {
            row: 3,
            column: 17
          }
        });
      });
      it('has marker for alias (lhs) "n"', function() {
        return markerCheck('newlines-and-spacing.sql', {
          index: 1,
          start: {
            row: 5,
            column: 4
          },
          end: {
            row: 5,
            column: 5
          }
        });
      });
      return it('has marker for alias (rhs) "f"', function() {
        return markerCheck('newlines-and-spacing.sql', {
          index: 2,
          start: {
            row: 5,
            column: 19
          },
          end: {
            row: 5,
            column: 20
          }
        });
      });
    });
    describe('ignores markers', function() {
      return it('has marker @ "[test_brackets] b"', function() {
        return markerCheck('brackets.sql', {
          index: 0,
          start: {
            row: 0,
            column: 14
          },
          end: {
            row: 0,
            column: 31
          }
        });
      });
    });
    describe('alias before table is defined', function() {
      it('has marker for alias "d" despite appearing before defined', function() {
        return markerCheck('alias-before-defined.sql', {
          index: 0,
          start: {
            row: 0,
            column: 7
          },
          end: {
            row: 0,
            column: 8
          }
        });
      });
      return it('has a marker @ "defined_later d"', function() {
        return markerCheck('alias-before-defined.sql', {
          index: 1,
          start: {
            row: 0,
            column: 18
          },
          end: {
            row: 0,
            column: 33
          }
        });
      });
    });
    describe('from statement with temp table', function() {
      return it('has marker @ "temp1" despite schema', function() {
        return markerCheck('temp-table-1.sql', {
          index: 0,
          start: {
            row: 0,
            column: 15
          },
          end: {
            row: 0,
            column: 20
          }
        });
      });
    });
    describe('into statement with temp table', function() {
      return it('has marker @ "temp2 tmp2" despite schema', function() {
        return markerCheck('temp-table-2.sql', {
          index: 0,
          start: {
            row: 0,
            column: 15
          },
          end: {
            row: 0,
            column: 25
          }
        });
      });
    });
    describe('insert into statement', function() {
      it('has marker @ "insert_table"', function() {
        return markerCheck('insert-into-1.sql', {
          index: 0,
          start: {
            row: 0,
            column: 12
          },
          end: {
            row: 0,
            column: 24
          }
        }, true);
      });
      it('has marker @ "insert_table"', function() {
        return markerCheck('insert-into-2.sql', {
          index: 0,
          start: {
            row: 0,
            column: 12
          },
          end: {
            row: 0,
            column: 24
          }
        });
      });
      return it('has marker @ "insert_table" despite schema', function() {
        return markerCheck('insert-into-2-with-schema.sql', {
          index: 0,
          start: {
            row: 0,
            column: 21
          },
          end: {
            row: 0,
            column: 32
          }
        }, true);
      });
    });
    describe('insert into statement breaks with space', function() {
      it('has marker @ "f"', function() {
        return markerCheck('insert-into-2-does-not-break.sql', {
          index: 0,
          start: {
            row: 0,
            column: 7
          },
          end: {
            row: 0,
            column: 8
          }
        });
      });
      it('has marker @ "foo f"', function() {
        return markerCheck('insert-into-2-does-not-break.sql', {
          index: 1,
          start: {
            row: 0,
            column: 18
          },
          end: {
            row: 0,
            column: 23
          }
        });
      });
      it('has marker @ "f"', function() {
        return markerCheck('insert-into-2-does-not-break.sql', {
          index: 2,
          start: {
            row: 0,
            column: 30
          },
          end: {
            row: 0,
            column: 31
          }
        });
      });
      it('has marker @ "f"', function() {
        return markerCheck('insert-into-2-does-not-break.sql', {
          index: 3,
          start: {
            row: 0,
            column: 38
          },
          end: {
            row: 0,
            column: 39
          }
        });
      });
      return it('has marker @ "insert_table"', function() {
        return markerCheck('insert-into-2-does-not-break.sql', {
          index: 4,
          start: {
            row: 3,
            column: 12
          },
          end: {
            row: 3,
            column: 24
          }
        });
      });
    });
    describe('join statement', function() {
      describe('tables expression', function() {
        it('has marker @ "person p"', function() {
          return markerCheck('join-statement.sql', {
            index: 0,
            start: {
              row: 0,
              column: 10
            },
            end: {
              row: 0,
              column: 18
            }
          });
        });
        return it('has marker @ "foo f"', function() {
          return markerCheck('join-statement.sql', {
            index: 3,
            start: {
              row: 0,
              column: 39
            },
            end: {
              row: 0,
              column: 44
            }
          });
        });
      });
      describe('on expression', function() {
        it('has marker for alias (lhs) "p"', function() {
          return markerCheck('join-statement.sql', {
            index: 1,
            start: {
              row: 0,
              column: 22
            },
            end: {
              row: 0,
              column: 23
            }
          });
        });
        it('has marker for alias (rhs) "f"', function() {
          return markerCheck('join-statement.sql', {
            index: 2,
            start: {
              row: 0,
              column: 29
            },
            end: {
              row: 0,
              column: 30
            }
          });
        });
        it('has marker for alias (lhs) "f"', function() {
          return markerCheck('join-statement.sql', {
            index: 4,
            start: {
              row: 0,
              column: 48
            },
            end: {
              row: 0,
              column: 49
            }
          });
        });
        return it('has marker for alias (rhs) "p"', function() {
          return markerCheck('join-statement.sql', {
            index: 5,
            start: {
              row: 0,
              column: 53
            },
            end: {
              row: 0,
              column: 54
            }
          });
        });
      });
      xdescribe('cartesian without aliases', function() {
        it('has marker on table "employee"', function() {
          return markerCheck('cartesian-no-alias.sql', {
            index: 0,
            start: {
              row: 0,
              column: 14
            },
            end: {
              row: 0,
              column: 22
            }
          });
        });
        it('has marker on table "department"', function() {
          return markerCheck('cartesian-no-alias.sql', {
            index: 1,
            start: {
              row: 0,
              column: 24
            },
            end: {
              row: 0,
              column: 34
            }
          });
        });
        it('has marker on table "department"', function() {
          return markerCheck('cartesian-no-alias.sql', {
            index: 2,
            start: {
              row: 1,
              column: 6
            },
            end: {
              row: 1,
              column: 15
            }
          });
        });
        return it('has marker on table "department"', function() {
          return markerCheck('cartesian-no-alias.sql', {
            index: 3,
            start: {
              row: 1,
              column: 30
            },
            end: {
              row: 1,
              column: 40
            }
          });
        });
      });
      xdescribe('cartesian with aliases', function() {
        it('has marker on table "employee e"', function() {
          return markerCheck('cartesian-alias.sql', {
            index: 0,
            start: {
              row: 0,
              column: 14
            },
            end: {
              row: 0,
              column: 24
            }
          });
        });
        it('has marker on table "department d"', function() {
          return markerCheck('cartesian-alias.sql', {
            index: 1,
            start: {
              row: 0,
              column: 26
            },
            end: {
              row: 0,
              column: 38
            }
          });
        });
        it('has marker on table "e"', function() {
          return markerCheck('cartesian-alias.sql', {
            index: 2,
            start: {
              row: 1,
              column: 6
            },
            end: {
              row: 1,
              column: 7
            }
          });
        });
        return it('has marker on table "d"', function() {
          return markerCheck('cartesian-alias.sql', {
            index: 3,
            start: {
              row: 1,
              column: 24
            },
            end: {
              row: 1,
              column: 25
            }
          });
        });
      });
      return describe('join with no aliases', function() {
        it('has marker on table "employee"', function() {
          return markerCheck('join-statement-no-alias.sql', {
            index: 0,
            start: {
              row: 0,
              column: 14
            },
            end: {
              row: 0,
              column: 22
            }
          });
        });
        it('has marker on table "department"', function() {
          return markerCheck('join-statement-no-alias.sql', {
            index: 1,
            start: {
              row: 0,
              column: 28
            },
            end: {
              row: 0,
              column: 38
            }
          });
        });
        it('has marker on table (lhs) "employee"', function() {
          return markerCheck('join-statement-no-alias.sql', {
            index: 2,
            start: {
              row: 0,
              column: 42
            },
            end: {
              row: 0,
              column: 50
            }
          });
        });
        return it('has marker on table (rhs) "department"', function() {
          return markerCheck('join-statement-no-alias.sql', {
            index: 3,
            start: {
              row: 0,
              column: 66
            },
            end: {
              row: 0,
              column: 76
            }
          });
        });
      });
    });
    describe('from statement with schemas', function() {
      it('has alias marker @ "tab" despite schema and defined after', function() {
        return markerCheck('schema-base-case.sql', {
          index: 0,
          start: {
            row: 0,
            column: 7
          },
          end: {
            row: 0,
            column: 10
          }
        });
      });
      it('has table marker @ "myTable" despite schema', function() {
        return markerCheck('schema-base-case.sql', {
          index: 1,
          start: {
            row: 0,
            column: 31
          },
          end: {
            row: 0,
            column: 38
          }
        });
      });
      it('has alias marker @ " tab" despite schema', function() {
        return markerCheck('schema-base-case.sql', {
          index: 2,
          start: {
            row: 0,
            column: 38
          },
          end: {
            row: 0,
            column: 42
          }
        });
      });
      it('has table marker @ "myTable" despite schema', function() {
        return markerCheck('schema-base-case-no-alias.sql', {
          index: 0,
          start: {
            row: 0,
            column: 27
          },
          end: {
            row: 0,
            column: 34
          }
        }, true);
      });
      it('has marker @ "myTable tab" despite schema and delete keyword', function() {
        return markerCheck('schema-delete-from.sql', {
          index: 0,
          start: {
            row: 0,
            column: 21
          },
          end: {
            row: 0,
            column: 28
          }
        });
      });
      return it('has marker @ "myTable tab" despite schema and delete keyword and newline', function() {
        return markerCheck('schema-delete-from-newline.sql', {
          index: 0,
          start: {
            row: 0,
            column: 21
          },
          end: {
            row: 0,
            column: 28
          }
        });
      });
    });
    return xdescribe('numbers in tables or aliases', function() {
      it('has marker @ "test2 t2"', function() {
        return markerCheck('numbers.sql', {
          index: 0,
          start: {
            row: 0,
            column: 14
          },
          end: {
            row: 0,
            column: 22
          }
        });
      });
      return it('has marker for alias (lhs) "t2"', function() {
        return markerCheck('numbers.sql', {
          index: 1,
          start: {
            row: 0,
            column: 29
          },
          end: {
            row: 0,
            column: 31
          }
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvcW9sb3Ivc3BlYy9xb2xvci12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7O0dBQUE7QUFBQTtBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSlAsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNsQixRQUFBLFdBQUE7QUFBQSxJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDUCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsVUFBckIsQ0FBRCxDQUF0QixFQURPO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLFdBQUEsR0FBYyxTQUFDLFFBQUQsRUFBVyxNQUFYLEVBQW1CLE9BQW5CLEdBQUE7QUFDVixVQUFBLE1BQUE7O1FBRDZCLFVBQVU7T0FDdkM7QUFBQSxNQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGNBQTlCLEVBQUg7TUFBQSxDQUFoQixDQUZBLENBQUE7QUFBQSxNQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE9BQTlCLEVBQUg7TUFBQSxDQUFoQixDQUhBLENBQUE7YUFLQSxJQUFBLENBQUss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

//# sourceURL=/Users/vitaminafront/.atom/packages/qolor/spec/qolor-view-spec.coffee
