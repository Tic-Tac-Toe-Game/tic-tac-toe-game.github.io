const Choose = {
    CROSS: 'x',
    ZERO: 'o'
};

const ChooseSetting = {
    CROSS: {
        key: Choose.CROSS,
        name: 'Крестиком',
        className: Choose.CROSS,
        instance: TicTacToe.Choose.CROSS
    },
    ZERO: {
        key: Choose.ZERO,
        name: 'Ноликом',
        className: Choose.ZERO,
        instance: TicTacToe.Choose.ZERO
    }
};

const Result = React.createClass({
    render: function () {
        return (
            <a className="result" onClick={this.props.onResetScore}>
                <p>
                    <span className="me">{this.props.score.player}</span>:<span>{this.props.score.partner}</span>
                </p>
                <span className="dashed"><span>Обнулить</span></span>
            </a>
        );
    }
});

const Title = React.createClass({
    render: function() {
        return (
            <h2><span><b>Х</b></span><span>р</span><span>е</span><span>с</span><span>т</span><span>и</span><span>к</span><span>и</span><span>-</span><span>н</span><span><b>о</b></span><span>л</span><span>и</span><span>к</span><span>и</span></h2>
        );
    }
});

const Header = React.createClass({
    render: function () {
        return (
            <div className="header">
                <Title />
                <Result score={this.props.score} onResetScore={this.props.onResetScore} />
            </div>
        );
    }
});

const ChooseButton = React.createClass({
    render: function() {
        let className = 'btn' + ' ' + this.props.choose.className;

        return (
            <button className={className} onClick={this.props.setChoose}>Начать новую игру <br/> <b>{this.props.choose.name}</b></button>
        );
    }
});

const CloseButton = React.createClass({
    render() {
        return (
            <a href="javascript:void(0)" className="close" onClick={this.props.action}>✕</a>
        );
    }
});

const Status = React.createClass({
    propTypes: {
        message: React.PropTypes.string.isRequired,
        choose: React.PropTypes.string
    },

    getInitialState: function() {
        return {};
    },

    handleClose: function() {
        this.setState({
            display: 'none'
        });
    },

    render: function() {
        var hideStyle = {
            display: this.state.display
        };

        let className = 'status';

        if (this.props.choose) {
            className += ' ' + this.props.choose;
        }

        return (
            <p className={className} style={hideStyle}>{this.props.message}<CloseButton action={this.handleClose} /></p>
        );
    }
});

const Control = React.createClass({
    render: function() {
        let status = null;

        if (this.props.over) {
            if (this.props.over.getWinner()) {
                let message = (this.props.over.getWinner().getChoose() === this.props.choose.player) ? 'Вы выиграли!' : 'Вы проиграли!';

                status = <Status choose={this.props.choose.player.className} message={message} />
            } else {
                status = <Status message='Ничья!' />;
            }
        }

        return (
            <div className="controls">
                {status}
                <p>
                    <ChooseButton choose={ChooseSetting.CROSS} setChoose={this.props.onCrossClick} />
                    <ChooseButton choose={ChooseSetting.ZERO} setChoose={this.props.onZeroClick} />
                </p>
            </div>
        );
    }
});

const Cell = React.createClass({
    handleClick: function () {
        this.props.onClick(this.props.index);
    },

    render: function() {
        if (this.props.select) {
            let className = 'btn' + ' ' + this.props.select.className;

            if (this.props.select.className) {
                className += ' ' + this.props.select.className;
            }

            if (this.props.winnerPoint) {
                className += ' ' + 'win';
            }

            return (
                <button className={className}>{this.props.select.key}</button>
            );
        }

        return (
            <button onClick={this.handleClick} className="btn"></button>
        );
    }
});

const Content = React.createClass({
    componentWillReceiveProps: function() {
        this.setState(this.getInitialState());
    },

    getInitialState: function () {
        return {};
    },

    render: function() {
        let matrixStateList = this.props.matrix;

        let rows = [];

        let winner = this.props.over && this.props.over.getWinner();

        for (let i = 0; i < 3; ++i) {
            var cols = [];
            for (let j = 0; j < 3; ++j) {
                let index = i * 3 + j;

                let winnerPoint = winner && winner.getLine().indexOf(index) > -1;

                cols.push(
                    <td key={index}>
                        <Cell
                            key={index}
                            index={index}
                            select={matrixStateList[index]}
                            choose={this.props.choose.player}
                            onClick={this.props.onClickPoint}
                            winnerPoint={winnerPoint}
                        />
                    </td>
                );
            }

            rows.push(
                <tr key={i}>{cols}</tr>
            );
        }

        let className = this.props.over ? 'mask' : '';

        return (
            <div className="content">
                <table cellSpacing="0" cellPadding="0" className={className}>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

/**
 * @type {TicTacToe.Game}
 */
let game;

function startGame(state) {
    game = new TicTacToe.Game(state.choose.player, state.choose.partner);

    state.matrix = game.getMatrix();
    state.over = null;
}

const Application = React.createClass({
    getInitialState: function() {
        let state = {
            choose: {
                player: ChooseSetting.CROSS,
                partner: ChooseSetting.ZERO
            },
            score: {
                player: 0,
                partner: 0
            }
        };

        startGame(state);

        return state;
    },

    handleSetCrossChoose: function() {
        let state = {
            choose: {
                player: ChooseSetting.CROSS,
                partner: ChooseSetting.ZERO
            }
        };

        startGame(state);

        this.setState(state);
    },

    handleSetZeroChoose: function() {
        let state = {
            choose: {
                player: ChooseSetting.ZERO,
                partner: ChooseSetting.CROSS
            }
        };

        startGame(state);

        this.setState(state);
    },

    setMatrixPoint: function(index) {
        game.setPoint(index);

        var over = game.getOver();

        var score = this.state.score;

        if (over && over.getWinner()) {
            var winner = over.getWinner();

            if (winner.getChoose() === game.player) {
                ++score.player;
            } else {
                ++score.partner;
            }
        }

        this.setState({
            matrix: game.getMatrix(),
            over: over,
            score: score
        });
    },

    handleResetScore: function() {
        this.setState({
            score: {
                player: 0,
                partner: 0
            }
        })
    },

    render: function() {
        return (
            <div className="app">
                <Header onResetScore={this.handleResetScore} score={this.state.score} />
                <Control
                    over={this.state.over}
                    choose={this.state.choose}
                    onCrossClick={this.handleSetCrossChoose}
                    onZeroClick={this.handleSetZeroChoose}
                />
                <Content
                    over={this.state.over}
                    choose={this.state.choose}
                    onClickPoint={this.setMatrixPoint}
                    matrix={this.state.matrix}
                />
            </div>
        );
    }
});

ReactDOM.render(
    <Application />,
    document.getElementById('js-app')
);