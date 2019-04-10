const path = require('path');
const exec = require('child_process').exec;
const expect = require('chai').expect;

it('builds cleanly with no warnings', function(done) {
  this.timeout(20 * 1000); // `ember build` can take a while...

  exec(
    'node_modules/.bin/ember build',
    { cwd: path.join(__dirname, '..'), env: process.env },
    (err, stdout, stderr) => {
      if (err) {
        done(err);
      } else {
        expect(stderr)
          .to.not.match(/Circular dependency: [\w./-]+\/websocket\.js\b/)
          .to.not.match(
            /node-resolve: setting options\.jsnext is deprecated, please override options\.mainFields instead\r?\n/
          )
          .to.not.match(
            /node-resolve: setting options\.main is deprecated, please override options\.mainFields instead\r?\n/
          );
        done();
      }
    }
  );
});
