

    //   //exporting this object to webpack:
    //   const path = require('path');
    //   module.exports {
    //       /* '.' stands for current folder: */
    //       entry: './src/js/index.js' /*entry point where webapck will start bundling.it will star lokinf here for all the dependencies which it would bound together*/

    //       output: {
    //           path: path.resolve(__dirname, 'dist/js'), /*we need acces to absolute path and we can only do this with built in node package - line 4 */
    //           file: 'bundle.js'
    //       },  //where to save our bundle file
    //       mode: 'development' //the code will be faster but not compressed like in 'production' mode
    //   }


      const path = require('path');
      const HtmlWebpackPlugin = require('html-webpack-plugin');

      module.exports = {
        
          entry: ['./src/js/index.js'],

          output: {
              path: path.resolve(__dirname, 'dist'), 
              filename: 'js/bundle.js'
          }, 
          devServer: {
              contentBase: './dist' //all final code of the app that is going to be distributed= go to our client is here in the distribution folder. All our dev code is in the src file- there we work on the code and in the dist it is simply compiled
          },
          plugins: [
              new HtmlWebpackPlugin({
                  filename: 'index.html', //the html plugin copied the html file from the src dile into the dist file so we do not have to put an html file there
                  template: './src/index.html'
              })

          ],
          module: {
              rules: [
                  {
                      test: /\.js$/, //testing all the js files
                      exclude: /node_modules/,
                      use: {
                          loader: 'babel-loader'
                      }
                  }
              ] //all loaders we wanna use, each loader is an object
          }

         
      };

