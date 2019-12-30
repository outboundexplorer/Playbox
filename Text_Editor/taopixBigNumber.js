var TaopixBigNumber = /** @class */ (function () {
    function TaopixBigNumber() {
    }
    /**
     * Scale large number down to a number.
     *
     * @param pValue Big number to be converted.
     */
    TaopixBigNumber.scaleNumberDown = function (pValue) {
        var value = 0;
        if (typeof (pValue) == 'string') {
            value = parseFloat(pValue);
        }
        else {
            value = pValue;
        }
        return Number(value / 100000000000000);
    };
    /**
     * Scale a number up to a large number.
     */
    TaopixBigNumber.scaleNumberUp = function (pValue) {
        var value = 0;
        if (typeof (pValue) == 'string') {
            value = parseFloat(pValue);
        }
        else {
            value = pValue;
        }
        // we use a double instead of a single to hold the accuracy of the floating point number better
        return (value * 100000000000000);
    };
    /**
     * Compare two big numbers.
     *
     * @param pLeft Left operand to compare.
     * @param pRight Right operand to compare.
     * @returns {0 if ==, -1 if pLeft < pRight, 1 if pLeft > pRight}.
     */
    TaopixBigNumber.cmp = function (pLeft, pRight) {
        var leftParam = new Decimal(pLeft);
        var rightParam = new Decimal(pRight);
        return leftParam.cmp(rightParam);
    };
    /**
     * Add two big numbers.
     *
     * @param pLeft Left operand to add.
     * @param pRight Right operand to add.
     * @param pPrecision Decimal places to truncate to.
     * @returns The result of the add process.
     */
    TaopixBigNumber.addWithPrecision = function (pLeft, pRight, pPrecision) {
        // If one of the value is 0 then no need to do any calculation.
        if (pLeft == '0') {
            return pRight.toString();
        }
        else if (pRight == '0') {
            return pLeft.toString();
        }
        else {
            var leftParam = new Decimal(pLeft);
            var rightParam = new Decimal(pRight);
            return leftParam.add(rightParam).toFixed(pPrecision);
        }
    };
    /**
     * Add two big numbers respecting the default precision (kBigNumberScale).
     *
     * @param pLeft Left operand to add.
     * @param pRight Right operand to add.
     * @returns The result of the add process.
     */
    TaopixBigNumber.add = function (pLeft, pRight) {
        return TaopixBigNumber.addWithPrecision(pLeft, pRight, kBigNumberScale);
    };
    /**
     * Remove the right vaue from the left value.
     *
     * @param pLeft Left operand to remove the value from.
     * @param pRight Right operand Value to be removed
     * @param pPrecision Decimal places to truncate to.
     * @return The result of the subtraction.
     */
    TaopixBigNumber.subWithPrecision = function (pLeft, pRight, pPrecision) {
        // If we are removing 0, no need to do any calculation.
        if (pRight == '0') {
            return pLeft.toString();
        }
        else {
            var leftParam = new Decimal(pLeft);
            var rightParam = new Decimal(pRight);
            return leftParam.minus(rightParam).toFixed(pPrecision);
        }
    };
    /**
     * Remove the right vaue from the left value respecting the default precision (kBigNumberScale).
     *
     * @param pLeft Left operand to remove the value from.
     * @param pRight Right operand Value to be removed
     * @return The result of the subtraction.
     */
    TaopixBigNumber.sub = function (pLeft, pRight) {
        return TaopixBigNumber.subWithPrecision(pLeft, pRight, kBigNumberScale);
    };
    /**
     * Multiply a big number.
     *
     * @param pLeft Left operand to mutiply.
     * @param pRight Right operand Value to be multiply by.
     * @param pPrecision Decimal places to truncate to.
     * @return The result of the multiplication.
     */
    TaopixBigNumber.mulWithPrecision = function (pLeft, pRight, pPrecision) {
        // If one of the value is 0 no need to do any calculation.
        if ((pLeft == '0') || (pRight == '0')) {
            return '0';
        }
        else {
            var leftParam = new Decimal(pLeft);
            var rightParam = new Decimal(pRight);
            return leftParam.mul(rightParam).toFixed(pPrecision);
        }
    };
    /**
     * Multiply a big number respecting the default precision (kBigNumberScale).
     *
     * @param pLeft Left operand to mutiply.
     * @param pRight Right operand Value to be multiply by.
     * @return The result of the multiplication.
     */
    TaopixBigNumber.mul = function (pLeft, pRight) {
        return TaopixBigNumber.mulWithPrecision(pLeft, pRight, kBigNumberScale);
    };
    /**
     * Divide a big number
     *
     * @param pLeft Left operand to divide.
     * @param pRight Right operand Value to be divide by.
     * @param pPrecision Decimal places to truncate to.
     * @return The result of the division.
     */
    TaopixBigNumber.divWithPrecision = function (pLeft, pRight, pPrecision) {
        // If the value is 0, no need to do any calculation.
        if (pLeft == '0') {
            return pLeft;
        }
        else {
            var leftParam = new Decimal(pLeft);
            var rightParam = new Decimal(pRight);
            return leftParam.div(rightParam).toFixed(pPrecision);
        }
    };
    /**
     * Divide a big number respecting the default precision (kBigNumberScale).
     *
     * @param pLeft Left operand to divide.
     * @param pRight Right operand Value to be divide by.
     * @return The result of the division.
     */
    TaopixBigNumber.div = function (pLeft, pRight) {
        return TaopixBigNumber.divWithPrecision(pLeft, pRight, kBigNumberScale);
    };
    /**
     * Round a big number respecting the precision.
     *
     * @param pValue Value to be rounded.
     * @param pPrecision Rounding precision.
     * @param pPrecision Decimal places to truncate to.
     * @returns Value rounded.
     */
    TaopixBigNumber.round = function (pValue, pPrecision) {
        var valueParam = new Decimal(pValue);
        return Number(valueParam.round().toFixed(pPrecision));
    };
    /**
     * Retrun the negative valeu of a big number.
     *
     * @param pValue Value to be negated.
     * @returns Nageted value.
     */
    TaopixBigNumber.neg = function (pValue) {
        var valueParam = new Decimal(pValue);
        return valueParam.neg().toFixed(kBigNumberScale);
    };
    return TaopixBigNumber;
}());
