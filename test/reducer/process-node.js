import expect from 'expect';

import processNode from '../../lib/reducer/process-node';
import Link from '../../lib/reducer/link';

describe('Nodes processing', () => {
  it('Single node', () => {
    const result = processNode({
      _id: 'a',
      title: 'A'
    }, {
      _id: 1,
      title: 1
    });

    expect(result).toEqual({
      relativeNodes: 'a',
      nodes: ['a'],
      changes: {
        a: {
          _id: 'a',
          title: 'A'
        }
      }
    });
  });

  it('Array node', () => {
    const result = processNode([
      {
        _id: 'a',
        title: 'A'
      },
      {
        _id: 'b',
        title: 'B'
      }
    ], {
      _id: 1,
      title: 1
    });

    expect(result).toEqual({
      relativeNodes: ['a', 'b'],
      nodes: ['a', 'b'],
      changes: {
        a: {
          _id: 'a',
          title: 'A'
        },
        b: {
          _id: 'b',
          title: 'B'
        }
      }
    });
  });

  it('Nested nodes', () => {
    const result = processNode([
      {
        _id: 'a',
        title: 'A',
        user: {
          _id: 'user1',
          username: 'User 1'
        }
      },
      {
        _id: 'b',
        title: 'B',
        user: {
          _id: 'user2',
          username: 'User 2'
        }
      },
      {
        _id: 'c',
        title: 'C',
        user: {
          _id: 'user1',
          username: 'User 1'
        }
      }
    ], {
      _id: 1,
      title: 1,
      user: {
        _id: 1,
        username: 1
      }
    });

    expect(result).toEqual({
      relativeNodes: ['a', 'b', 'c'],
      nodes: ['a', 'user1', 'b', 'user2', 'c'],
      changes: {
        a: {
          _id: 'a',
          title: 'A',
          user: new Link('user1')
        },
        b: {
          _id: 'b',
          title: 'B',
          user: new Link('user2')
        },
        c: {
          _id: 'c',
          title: 'C',
          user: new Link('user1')
        },
        user1: {
          _id: 'user1',
          username: 'User 1'
        },
        user2: {
          _id: 'user2',
          username: 'User 2'
        }
      }
    });
  });

  it('Deep nested nodes', () => {
    const result = processNode([
      {
        _id: 'a',
        title: 'A',
        user: {
          _id: 'user1',
          username: 'User 1',
          nested: {
            _id: 'nested1',
            something: 'something 1'
          }
        }
      }
    ], {
      _id: 1,
      title: 1,
      user: {
        _id: 1,
        username: 1,
        nested: {
          _id: 1,
          something: 1
        }
      }
    });

    expect(result).toEqual({
      relativeNodes: ['a'],
      nodes: ['a', 'user1', 'nested1'],
      changes: {
        a: {
          _id: 'a',
          title: 'A',
          user: new Link('user1')
        },
        user1: {
          _id: 'user1',
          username: 'User 1',
          nested: new Link('nested1')
        },
        nested1: {
          _id: 'nested1',
          something: 'something 1'
        }
      }
    });
  });

  it('Arbitrary structure nodes (without id)', () => {
    const result = processNode([
      {
        title: 'A',
        user: {
          _id: 'user1',
          username: 'User 1'
        }
      },
      {
        title: 'B',
        user: {
          _id: 'user1',
          username: 'User 1'
        }
      }
    ], {
      title: 1,
      user: {
        _id: 1,
        username: 1
      }
    }, 'pages');

    expect(result).toEqual({
      relativeNodes: ['pages'],
      nodes: ['user1', 'pages'],
      changes: {
        pages: [
          {
            title: 'A',
            user: new Link('user1')
          }, {
            title: 'B',
            user: new Link('user1')
          }
        ],
        user1: {
          _id: 'user1',
          username: 'User 1'
        }
      }
    });
  });
});
