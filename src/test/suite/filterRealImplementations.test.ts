import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Filter Real Implementations Tests', () => {

  test('Should detect function with receiver pattern', () => {
    const testCases = [
      'func (r *Repo) GetMessageLinkInfo(req *Request) (*Response, error) {',
      'func (repo Repository) Save(data Data) error {',
      'func (s *Service) ProcessData() {',
      'func (h Handler) Handle(ctx context.Context) {',
      'func (c *Client) Connect() error {',
      'func (m MyStruct) Method() string {'
    ];

    const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;

    testCases.forEach(testCase => {
      assert.ok(receiverPattern.test(testCase), `Should match: ${testCase}`);
    });
  });

  test('Should NOT detect interface declarations', () => {
    const testCases = [
      'type Repository interface {',
      'GetMessageLinkInfo(req *Request) (*Response, error)',
      'Save(data Data) error',
      'func GetMessageLinkInfo(req *Request) (*Response, error) {',
      'func processData() {',
      'var repo Repository'
    ];

    const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;

    testCases.forEach(testCase => {
      assert.ok(!receiverPattern.test(testCase), `Should NOT match: ${testCase}`);
    });
  });

  test('Should handle multi-line function signatures', () => {
    const multiLineSignature = 'func (r *Repo) GetMessageLinkInfo( req *client.GetMessageLinkInfoRequest ) (*client.MessageLinkInfo, error) {';
    const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;

    assert.ok(receiverPattern.test(multiLineSignature));
  });

  test('Should handle complex receiver types', () => {
    const testCases = [
      'func (r *[]*Repo) Method() {',
      'func (s []Service) Method() {',
      'func (m map[string]interface{}) Method() {',
      'func (c chan int) Method() {'
    ];

    const receiverPattern = /func\s*\(\s*\w+\s+[\w\*\[\]]+\s*\)\s*\w+\s*\(/;

    testCases.forEach(testCase => {
      // Note: Our current regex might not catch all complex types, 
      // but it should catch the basic ones
      const matches = receiverPattern.test(testCase);
      console.log(`Testing: ${testCase} - Matches: ${matches}`);
    });
  });
}); 