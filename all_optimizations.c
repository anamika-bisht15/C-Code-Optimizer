// C Program to test all compiler optimization passes
int main() {
    // 1. Constant Folding
    int size = 100 + 200 * 3;
    
    // 2. Constant Propagation
    int offset = size;
    
    // 3. Copy Propagation
    int index = offset;
    
    // 4. Strength Reduction
    int multiplier = index * 4;
    
    // 5. Common Subexpression Elimination
    int val1 = index + multiplier;
    int val2 = index + multiplier;
    
    // 6. Unused Variable Removal
    int debugMode = 1;
    int temp = 999;
    
    // 7. Loop Invariant Code Motion (LICM)
    int i = 0;
    int sum = 0;
    while (i < 10) {
        int scalingFactor = 2 * 5; // Loop invariant
        sum = sum + scalingFactor * i;
        i = i + 1;
    }
    
    // 8. Dead Code Elimination
    if (0) {
        sum = sum - 500;
    }
    
    return sum + val1 + val2;
}
