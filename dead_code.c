// C Program to test Dead Code Elimination
int main() {
    int active = 0;
    int value = 50;
    
    if (active) {
        value = value + 100;
    } else {
        value = value * 2;
    }
    
    if (0) {
        value = 0; // Unreachable dead code block
    }
    
    return value;
}
