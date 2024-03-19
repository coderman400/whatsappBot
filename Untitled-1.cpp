#include <iostream.h>
using namespace std;
class Solution {
public:
    bool isValid(string s) {
        stack<char> stack;
        for(int i=0; i<s.length(); i++){
            if(s[i]=='(' || s[i]=='[' || s[i]=='{'){
                stack.push(s[i]);
                continue;
            }
            switch(s[i]){
                case ')':
                    if(stack.top()=='('){
                        stack.pop();
                    }
                    break;
                case ']':
                    if(stack.top()=='['){
                        stack.pop();
                    }
                    break;
                case '}':
                    if(stack.top()=='{'){
                        stack.pop();
                    }
                    break;
                default:
                    break;
            }
        }
        if(stack.empty()){
            return true;
        }else{
            return false;
        }
    }
};

int main(){
    Solution s1;
    cout<<s1.isvalid("[]()]");
}