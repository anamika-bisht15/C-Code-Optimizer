// C Program to test Loop Invariant Code Motion (Loop Optimization)
int main() {
    int i = 0;
    int total = 0;
    int baseVal = 12;
    int factor = 4;
    
    while (i < 500) {
        // baseVal * factor is invariant inside loop body
        int invariantCalc = baseVal * factor;
        total = total + invariantCalc + i;
        i = i + 1;
    }
    
    return total;
}
