Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _csscomb = require('csscomb');

var _csscomb2 = _interopRequireDefault(_csscomb);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

exports['default'] = {
    config: {
        projectConfigs: {
            title: 'Use project config',
            description: 'Relative to the project directory. Example: `.csscomb.json` or `configs/.csscomb.json`. Leave blank if you want to use the following setting',
            'default': '',
            type: 'string'
        },
        commonConfigs: {
            title: 'Use common config',
            description: 'Put here a full path to your config. Example: `/Users/jchouse/propjects/.csscomb.json`. Leave blank if you want to use the following setting',
            'default': '',
            type: 'string'
        },
        readyMadeConfigs: {
            title: 'Ready made configs',
            description: 'Used when you do not specify a project or common file. The details below.',
            type: 'string',
            'default': 'yandex',
            'enum': ['yandex', 'csscomb', 'zen']
        }
    },

    getSettingsConfig: function getSettingsConfig() {
        var cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb'),
            error,
            optionsFilePath,
            projectConfigs = atom.config.get('atom-css-comb.projectConfigs'),
            projectPath = atom.project.getPaths()[0],
            commonConfigs = atom.config.get('atom-css-comb.commonConfigs'),
            readyMadeConfigs = atom.config.get('atom-css-comb.readyMadeConfigs');

        if (projectConfigs) {
            optionsFilePath = _path2['default'].join(projectPath, projectConfigs);
            try {
                return require(optionsFilePath);
            } catch (error) {
                return error;
            }
        } else if (commonConfigs) {
            try {
                return require(commonConfigs);
            } catch (error) {
                return error;
            }
        } else {
            return readyMadeConfigs || 'yandex';
        }
    },

    activate: function activate(state) {
        var _this = this;

        this.subscriptions = new _atom.CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'css-comb:comb': function cssCombComb() {
                return _this.comb();
            }
        }));
    },

    combFile: function combFile(comb, syntax) {
        try {
            var text = this._getText(),
                combed = comb.processString(text, { syntax: syntax });

            atom.workspace.getActivePaneItem().setText(combed);
        } catch (error) {
            atom.notifications.addError(error.message);
        }
    },

    combText: function combText(comb, text) {
        var combed,
            syntax = this._getSytax(),
            activePane = atom.workspace.getActivePaneItem();

        try {
            combed = comb.processString(text, { syntax: syntax });

            activePane.setTextInBufferRange(activePane.getSelectedBufferRange(), combed);
        } catch (error) {
            atom.notifications.addError(error.message);
        }
    },

    _getSytax: function _getSytax() {
        var syntax = atom.workspace.getActiveTextEditor().getGrammar().name.toLowerCase();

        if (['css', 'less', 'sass', 'scss'].indexOf(syntax) !== -1) {
            return syntax;
        } else if (syntax === 'html') {
            return 'css';
        } else {
            return new Error();
        }
    },

    _getSelectedText: function _getSelectedText() {
        return atom.workspace.getActiveTextEditor().getSelectedText();
    },

    _getText: function _getText() {
        return atom.workspace.getActiveTextEditor().getText();
    },

    comb: function comb() {
        var comb,
            config = this.getSettingsConfig(),
            selectedText = this._getSelectedText(),
            syntax = this._getSytax();

        if (config instanceof Error) {
            return atom.notifications.addError(config.message);
        } else if (syntax instanceof Error) {
            return atom.notifications.addError('Not supported syntax');
        } else {
            comb = new _csscomb2['default'](config);

            if (selectedText !== '') {
                this.combText(comb, selectedText, syntax);
            } else {
                var _name = atom.workspace.getActiveTextEditor().getGrammar().name;
                if (syntax === 'css' && _name === 'HTML') {
                    atom.notifications.addError('Please select the text for combing.');
                    return;
                }
                this.combFile(comb, syntax);
            }
        }
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL2F0b20tY3NzLWNvbWIvbGliL2Nzcy1jb21iLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFa0MsTUFBTTs7dUJBQ3ZCLFNBQVM7Ozs7b0JBQ1QsTUFBTTs7OztBQUp2QixXQUFXLENBQUM7O3FCQU1HO0FBQ1gsVUFBTSxFQUFFO0FBQ0osc0JBQWMsRUFBRTtBQUNaLGlCQUFLLEVBQUUsb0JBQW9CO0FBQzNCLHVCQUFXLEVBQUUsOElBQThJO0FBQzNKLHVCQUFTLEVBQUU7QUFDWCxnQkFBSSxFQUFFLFFBQVE7U0FDakI7QUFDRCxxQkFBYSxFQUFFO0FBQ1gsaUJBQUssRUFBRSxtQkFBbUI7QUFDMUIsdUJBQVcsRUFBRSw4SUFBOEk7QUFDM0osdUJBQVMsRUFBRTtBQUNYLGdCQUFJLEVBQUUsUUFBUTtTQUNqQjtBQUNELHdCQUFnQixFQUFFO0FBQ2QsaUJBQUssRUFBRSxvQkFBb0I7QUFDM0IsdUJBQVcsRUFBRSwyRUFBMkU7QUFDeEYsZ0JBQUksRUFBRSxRQUFRO0FBQ2QsdUJBQVMsUUFBUTtBQUNqQixvQkFBTSxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDO1NBQ3JDO0tBQ0o7O0FBRUQscUJBQWlCLEVBQUMsNkJBQUc7QUFDakIsWUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUM7WUFDaEUsS0FBSztZQUNMLGVBQWU7WUFDZixjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUM7WUFDaEUsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztZQUM5RCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztBQUV6RSxZQUFJLGNBQWMsRUFBRTtBQUNoQiwyQkFBZSxHQUFHLGtCQUFLLElBQUksQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDekQsZ0JBQUk7QUFDQSx1QkFBTyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDbkMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNaLHVCQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKLE1BQU0sSUFBSSxhQUFhLEVBQUU7QUFDdEIsZ0JBQUk7QUFDQSx1QkFBTyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDakMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNaLHVCQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKLE1BQU07QUFDSCxtQkFBTyxnQkFBZ0IsSUFBSSxRQUFRLENBQUM7U0FDdkM7S0FDSjs7QUFFRCxZQUFRLEVBQUMsa0JBQUMsS0FBSyxFQUFFOzs7QUFDYixZQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCwyQkFBZSxFQUFFO3VCQUFNLE1BQUssSUFBSSxFQUFFO2FBQUE7U0FDbkMsQ0FBQyxDQUFDLENBQUM7S0FDUDs7QUFFRCxZQUFRLEVBQUMsa0JBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNwQixZQUFJO0FBQ0EsZ0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RCLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDOztBQUV4RCxnQkFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0RCxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ1osZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QztLQUNKOztBQUVELFlBQVEsRUFBQyxrQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2xCLFlBQUksTUFBTTtZQUNOLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3pCLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0FBRXBELFlBQUk7QUFDQSxrQkFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7O0FBRXBELHNCQUFVLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEYsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNaLGdCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUM7S0FDSjs7QUFFRCxhQUFTLEVBQUMscUJBQUc7QUFDVCxZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOztBQUVsRixZQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3hELG1CQUFPLE1BQU0sQ0FBQztTQUNqQixNQUFNLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTtBQUMxQixtQkFBTyxLQUFLLENBQUM7U0FDaEIsTUFBTTtBQUNILG1CQUFPLElBQUksS0FBSyxFQUFFLENBQUM7U0FDdEI7S0FDSjs7QUFFRCxvQkFBZ0IsRUFBQyw0QkFBRztBQUNoQixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUNqRTs7QUFFRCxZQUFRLEVBQUMsb0JBQUc7QUFDUixlQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN6RDs7QUFFRCxRQUFJLEVBQUMsZ0JBQUc7QUFDSixZQUFJLElBQUk7WUFDSixNQUFNLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ2pDLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDdEMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFOUIsWUFBSSxNQUFNLFlBQVksS0FBSyxFQUFFO0FBQ3pCLG1CQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN0RCxNQUFNLElBQUksTUFBTSxZQUFZLEtBQUssRUFBRTtBQUNoQyxtQkFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQzlELE1BQU07QUFDSCxnQkFBSSxHQUFHLHlCQUFTLE1BQU0sQ0FBQyxDQUFDOztBQUV4QixnQkFBSSxZQUFZLEtBQUssRUFBRSxFQUFFO0FBQ3JCLG9CQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDN0MsTUFBTTtBQUNILG9CQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQ25FLG9CQUFJLE1BQU0sS0FBSyxLQUFLLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtBQUN0Qyx3QkFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUNuRSwyQkFBTztpQkFDVjtBQUNELG9CQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNKO0tBQ0o7Q0FDSiIsImZpbGUiOiIvVXNlcnMvdml0YW1pbmFmcm9udC8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jb21iL2xpYi9jc3MtY29tYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IENvbWIgZnJvbSAnY3NzY29tYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbmZpZzoge1xuICAgICAgICBwcm9qZWN0Q29uZmlnczoge1xuICAgICAgICAgICAgdGl0bGU6ICdVc2UgcHJvamVjdCBjb25maWcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdSZWxhdGl2ZSB0byB0aGUgcHJvamVjdCBkaXJlY3RvcnkuIEV4YW1wbGU6IGAuY3NzY29tYi5qc29uYCBvciBgY29uZmlncy8uY3NzY29tYi5qc29uYC4gTGVhdmUgYmxhbmsgaWYgeW91IHdhbnQgdG8gdXNlIHRoZSBmb2xsb3dpbmcgc2V0dGluZycsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGNvbW1vbkNvbmZpZ3M6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnVXNlIGNvbW1vbiBjb25maWcnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdQdXQgaGVyZSBhIGZ1bGwgcGF0aCB0byB5b3VyIGNvbmZpZy4gRXhhbXBsZTogYC9Vc2Vycy9qY2hvdXNlL3Byb3BqZWN0cy8uY3NzY29tYi5qc29uYC4gTGVhdmUgYmxhbmsgaWYgeW91IHdhbnQgdG8gdXNlIHRoZSBmb2xsb3dpbmcgc2V0dGluZycsXG4gICAgICAgICAgICBkZWZhdWx0OiAnJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHJlYWR5TWFkZUNvbmZpZ3M6IHtcbiAgICAgICAgICAgIHRpdGxlOiAnUmVhZHkgbWFkZSBjb25maWdzJyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVXNlZCB3aGVuIHlvdSBkbyBub3Qgc3BlY2lmeSBhIHByb2plY3Qgb3IgY29tbW9uIGZpbGUuIFRoZSBkZXRhaWxzIGJlbG93LicsXG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICd5YW5kZXgnLFxuICAgICAgICAgICAgZW51bTogWyd5YW5kZXgnLCAnY3NzY29tYicsICd6ZW4nXVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGdldFNldHRpbmdzQ29uZmlnICgpIHtcbiAgICAgICAgdmFyIGNzc0NvbWJQYWNrYWdlID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdhdG9tLWNzcy1jb21iJyksXG4gICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgIG9wdGlvbnNGaWxlUGF0aCxcbiAgICAgICAgICAgIHByb2plY3RDb25maWdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzcy1jb21iLnByb2plY3RDb25maWdzJyksXG4gICAgICAgICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLFxuICAgICAgICAgICAgY29tbW9uQ29uZmlncyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jc3MtY29tYi5jb21tb25Db25maWdzJyksXG4gICAgICAgICAgICByZWFkeU1hZGVDb25maWdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzcy1jb21iLnJlYWR5TWFkZUNvbmZpZ3MnKTtcblxuICAgICAgICBpZiAocHJvamVjdENvbmZpZ3MpIHtcbiAgICAgICAgICAgIG9wdGlvbnNGaWxlUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgcHJvamVjdENvbmZpZ3MpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWlyZShvcHRpb25zRmlsZVBhdGgpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY29tbW9uQ29uZmlncykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWlyZShjb21tb25Db25maWdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJlYWR5TWFkZUNvbmZpZ3MgfHwgJ3lhbmRleCc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWN0aXZhdGUgKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICAgJ2Nzcy1jb21iOmNvbWInOiAoKSA9PiB0aGlzLmNvbWIoKVxuICAgICAgICB9KSk7XG4gICAgfSxcblxuICAgIGNvbWJGaWxlIChjb21iLCBzeW50YXgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gdGhpcy5fZ2V0VGV4dCgpLFxuICAgICAgICAgICAgICAgIGNvbWJlZCA9IGNvbWIucHJvY2Vzc1N0cmluZyh0ZXh0LCB7c3ludGF4OiBzeW50YXh9KTtcblxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKS5zZXRUZXh0KGNvbWJlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tYlRleHQgKGNvbWIsIHRleHQpIHtcbiAgICAgICAgdmFyIGNvbWJlZCxcbiAgICAgICAgICAgIHN5bnRheCA9IHRoaXMuX2dldFN5dGF4KCksXG4gICAgICAgICAgICBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29tYmVkID0gY29tYi5wcm9jZXNzU3RyaW5nKHRleHQsIHtzeW50YXg6IHN5bnRheH0pO1xuXG4gICAgICAgICAgICBhY3RpdmVQYW5lLnNldFRleHRJbkJ1ZmZlclJhbmdlKGFjdGl2ZVBhbmUuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpLCBjb21iZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRTeXRheCAoKSB7XG4gICAgICAgIHZhciBzeW50YXggPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0R3JhbW1hcigpLm5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoWydjc3MnLCAnbGVzcycsICdzYXNzJywgJ3Njc3MnXS5pbmRleE9mKHN5bnRheCkgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gc3ludGF4O1xuICAgICAgICB9IGVsc2UgaWYgKHN5bnRheCA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2Nzcyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldFNlbGVjdGVkVGV4dCAoKSB7XG4gICAgICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0U2VsZWN0ZWRUZXh0KCk7XG4gICAgfSxcblxuICAgIF9nZXRUZXh0ICgpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRUZXh0KCk7XG4gICAgfSxcblxuICAgIGNvbWIgKCkge1xuICAgICAgICB2YXIgY29tYixcbiAgICAgICAgICAgIGNvbmZpZyA9IHRoaXMuZ2V0U2V0dGluZ3NDb25maWcoKSxcbiAgICAgICAgICAgIHNlbGVjdGVkVGV4dCA9IHRoaXMuX2dldFNlbGVjdGVkVGV4dCgpLFxuICAgICAgICAgICAgc3ludGF4ID0gdGhpcy5fZ2V0U3l0YXgoKTtcblxuICAgICAgICBpZiAoY29uZmlnIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoY29uZmlnLm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2UgaWYgKHN5bnRheCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdOb3Qgc3VwcG9ydGVkIHN5bnRheCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tYiA9IG5ldyBDb21iKGNvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmIChzZWxlY3RlZFRleHQgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21iVGV4dChjb21iLCBzZWxlY3RlZFRleHQsIHN5bnRheCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBfbmFtZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRHcmFtbWFyKCkubmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoc3ludGF4ID09PSAnY3NzJyAmJiBfbmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUGxlYXNlIHNlbGVjdCB0aGUgdGV4dCBmb3IgY29tYmluZy4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNvbWJGaWxlKGNvbWIsIHN5bnRheCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIl19
//# sourceURL=/Users/vitaminafront/.atom/packages/atom-css-comb/lib/css-comb.js
