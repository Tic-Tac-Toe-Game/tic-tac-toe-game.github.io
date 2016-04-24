const TicTacToe = {
    size: 3,
    length: 9,
    winner: {
        map: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6]
        ],
        get: function (matrix, choose) {
            var map = TicTacToe.winner.map;
            for (var i = 0, length = map.length; i < length; ++i) {
                var line = map[i];

                if (matrix[line[0]] === choose && matrix[line[1]] === choose && matrix[line[2]] === choose) {
                    return new TicTacToe.Winner(choose, line);
                }
            }

            return null;
        },
        search: function (matrix) {
            var map = TicTacToe.winner.map;
            for (var i = 0, length = map.length; i < length; ++i) {
                var line = map[i];

                var choose = matrix[line[0]];

                if (choose && matrix[line[1]] === choose && matrix[line[2]] === choose) {
                    return new TicTacToe.Winner(choose, line);
                }
            }

            return null;
        }
    },
    isFinish: function (matrix) {
        return matrix.length === TicTacToe.length;
    }
};

TicTacToe.Matrix = function () {
    this.length = 0;
    this.values = [];
};

TicTacToe.Matrix.prototype.set = function (index, value) {
    this.values[index] = value;
    ++this.length;
};

TicTacToe.Choose = function () {};

TicTacToe.Choose.CROSS = new TicTacToe.Choose('x');
TicTacToe.Choose.ZERO = new TicTacToe.Choose('o');

TicTacToe.Game = function (player, partner) {
    this.player = player;
    this.partner = partner;
    this.matrix = new TicTacToe.Matrix();
    this.behavior = new TicTacToe.AdvanceBehavior(this);
    this.over = null;

    if (partner.instance === TicTacToe.Choose.CROSS) {
        this.matrix.set(this.behavior.getFirstPoint(), partner);
    }
};

TicTacToe.Behavior = function (game) {
    /**
     * @type {TicTacToe.Game}
     */
    this.game = game;
};

TicTacToe.Behavior.prototype.priority = [
    8, 7, 6, 5, 4, 3, 2, 1, 0
];

TicTacToe.Behavior.prototype.getFirstPoint = function () {
    return this.priority[0];
};

TicTacToe.Behavior.prototype.getAnswer = function() {
    var values = this.game.matrix.values;

    for (var i = 0; i < TicTacToe.length; ++i) {
        var point = this.priority[i];

        if (values[point]) continue;

        this.game.matrix.set(point, this.game.partner);

        return new TicTacToe.Answer(TicTacToe.winner.get(this.game.matrix.values, this.game.partner));
    }
};

TicTacToe.AdvanceBehavior = TicTacToe.Behavior;
TicTacToe.AdvanceBehavior.prototype = new TicTacToe.Behavior();
TicTacToe.AdvanceBehavior.prototype.priority = [
    4, 6, 2, 0, 1, 3, 5, 7, 8
];

TicTacToe.AdvanceBehavior.prototype.getAnswer = function() {
    var values = this.game.matrix.values;
    var queue = [];

    for (var i = 0; i < TicTacToe.length; ++i) {
        var point = this.priority[i];

        if (values[point]) continue;

        queue.push(point);
    }

    for (var i = 0; i < queue.length; ++i) {
        var point = queue[i];

        var copy = values.slice();

        copy[point] = this.game.partner;

        var winner = TicTacToe.winner.get(copy, this.game.partner);

        if (winner) {
            this.game.matrix.set(point, this.game.partner);
            return new TicTacToe.Answer(winner);
        }
    }

    for (var i = 0; i < queue.length; ++i) {
        var point = queue[i];

        var copy = values.slice();

        copy[point] = this.game.player;

        var winner = TicTacToe.winner.get(copy, this.game.player);

        if (winner) {
            this.game.matrix.set(point, this.game.partner);
            return new TicTacToe.Answer(null);
        }
    }

    this.game.matrix.set(queue[0], this.game.partner);
    return new TicTacToe.Answer(null);
};

TicTacToe.Answer = function (winner) {
    this.winner = winner;
};

TicTacToe.Answer.prototype.getWinner = function () {
    return this.winner;
};

TicTacToe.Game.prototype.getMatrix = function () {
    return this.matrix.values;
};

TicTacToe.Game.prototype.setPoint = function (index) {
    this.matrix.set(index, this.player);

    var winner = TicTacToe.winner.search(this.matrix.values);

    if (winner || TicTacToe.isFinish(this.matrix)) {
        this.over = new TicTacToe.Over(winner);
    } else {
        var answer = this.behavior.getAnswer();

        if (answer.getWinner()) {
            this.over = new TicTacToe.Over(answer.getWinner());
        } else if (TicTacToe.isFinish(this.matrix)) {
            this.over = new TicTacToe.Over();
        }
    }
};

/**
 *
 * @returns {TicTacToe.Over|null}
 */
TicTacToe.Game.prototype.getOver = function() {
    return this.over;
};

TicTacToe.Over = function (winner) {
    this.winner = winner;
};

/**
 *
 * @returns {TicTacToe.Winner|null}
 */
TicTacToe.Over.prototype.getWinner = function () {
    return this.winner;
};

TicTacToe.Winner = function(choose, line) {
    this.choose = choose;
    this.line = line;
};

TicTacToe.Winner.prototype.getChoose = function () {
    return this.choose;
};

TicTacToe.Winner.prototype.getLine = function () {
    return this.line;
};

// TODO: need better
var module = module || {};

module.exports = TicTacToe;