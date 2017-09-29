#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[], char *envp[]) {
        int i=0;
        char *username;

        while(envp[i]!= NULL) {
                if (strncmp("USER=", envp[i], 5) == 0) {
                        printf("%s\n", envp[i]);
                        username = envp[i] + 5;
                }

                i++;
        }
        printf("Username = %s.", username);
}
