// C Program to test Constant Folding
int main() {
    int foldedInteger = 10 + 20 * 30 - 5;
    float foldedFloat = 3.14 + 1.86;
    int shiftOperation = 1 << 5;
    int remainderOperation = 13 % 5;
    int conditionFold = (100 > 50) && (10 != 20);
    
    return foldedInteger + shiftOperation;
}
