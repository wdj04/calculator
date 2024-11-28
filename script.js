class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.clear();
        this.setupEventListeners();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.expression = [];
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        this.expression.push(parseFloat(this.currentOperand));
        this.expression.push(operation);
        
        this.previousOperand = this.getExpressionString();
        this.currentOperand = '0';
    }

    getExpressionString() {
        return this.expression.join(' ') + ' ';
    }

    getPrecedence(operator) {
        switch (operator) {
            case '×':
            case '÷':
                return 2;
            case '+':
            case '-':
                return 1;
            default:
                return 0;
        }
    }

    calculateExpression() {
        if (this.expression.length === 0) {
            return parseFloat(this.currentOperand);
        }

        let finalExpression = [...this.expression, parseFloat(this.currentOperand)];

        let i = 1;
        while (i < finalExpression.length - 1) {
            if (finalExpression[i] === '×' || finalExpression[i] === '÷') {
                let result;
                const prev = finalExpression[i - 1];
                const next = finalExpression[i + 1];
                
                if (finalExpression[i] === '×') {
                    result = prev * next;
                } else {
                    if (next === 0) throw new Error('不能除以0！');
                    result = prev / next;
                }
                
                finalExpression.splice(i - 1, 3, result);
                i = 1;
            } else {
                i += 2;
            }
        }

        let result = finalExpression[0];
        for (i = 1; i < finalExpression.length; i += 2) {
            const operator = finalExpression[i];
            const nextNum = finalExpression[i + 1];
            
            if (operator === '+') {
                result += nextNum;
            } else if (operator === '-') {
                result -= nextNum;
            }
        }

        return result;
    }

    compute() {
        try {
            const result = this.calculateExpression();
            this.currentOperand = this.formatNumber(result);
            this.previousOperand = '';
            this.expression = [];
        } catch (error) {
            this.showError(error.message);
        }
    }

    specialOperation(action) {
        const current = parseFloat(this.currentOperand);
        try {
            switch (action) {
                case 'square':
                    this.currentOperand = this.formatNumber(Math.pow(current, 2));
                    break;
                case 'sqrt':
                    if (current < 0) throw new Error('负数不能开平方！');
                    this.currentOperand = this.formatNumber(Math.sqrt(current));
                    break;
                case 'percent':
                    this.currentOperand = this.formatNumber(current / 100);
                    break;
                case 'plusMinus':
                    this.currentOperand = this.formatNumber(current * -1);
                    break;
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    formatNumber(number) {
        if (isNaN(number)) throw new Error('无效的计算！');
        if (!isFinite(number)) throw new Error('结果太大！');
        return Number(number.toFixed(8)).toString();
    }

    showError(message) {
        this.currentOperand = 'Error';
        alert(message);
        setTimeout(() => this.clear(), 1500);
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        this.previousOperandElement.innerText = this.previousOperand;
    }

    setupEventListeners() {
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
                this.updateDisplay();
            });
        });

        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.innerText);
                this.updateDisplay();
            });
        });

        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                if (action === 'clear') {
                    this.clear();
                } else if (action === 'delete') {
                    this.delete();
                } else {
                    this.specialOperation(action);
                }
                this.updateDisplay();
            });
        });

        document.querySelector('[data-equals]').addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });
    }
}

const calculator = new Calculator();