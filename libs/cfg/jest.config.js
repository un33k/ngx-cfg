module.exports = {
  name: 'cfg',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/cfg',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
