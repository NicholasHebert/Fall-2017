/* 3000test.c */
/* v1 Oct. 1, 2017 */
/* Licenced under the GPLv3, copyright Anil Somayaji */
/* You really shouldn't be incorporating parts of this in any other code,
   it is meant for teaching, not production */

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <fcntl.h>
#include <errno.h>
#include <string.h>

void report_error(char *error)
{
        fprintf(stderr, "Error: %s\n", error);

        exit(-1);
}

int main(int argc, char *argv[])
{
        struct stat statbuf;
        char *fn;
        int fd;
        size_t len, i, count;

        char *data;

        if (argc < 2) {
                if (argc < 1) {
                        report_error("no command line");
                        fprintf(stderr, "Usage: %s <file>\n", argv[0]);
                } else {
                        report_error("Not enough arguments");
                        fprintf(stderr, "Usage: %s <file>\n", argv[0]);
                }
        }

        fn = argv[1];

        if (lstat(fn, &statbuf)) {
                struct stat sb;
                char *linkname;
                ssize_t r;

                linkname = malloc(sb.st_size + 1);
                if (linkname == NULL) {
                        fprintf(stderr, "insufficient memory\n");
                        exit(-1);
                }
                r = readlink(argv[1], linkname, sb.st_size + 1);

                if (r < 0) {
                        perror("lstat");
                        exit(-1);
                }

                if (r > sb.st_size) {
                        fprintf(stderr, "symlink increased in size "
                                "between lstat() and readlink()\n");
                        exit(-1);
                }

                linkname[sb.st_size] = '\0';

                printf("'%s' points to '%s'\n", argv[1], linkname);

                exit(0);
        }

        len = statbuf.st_size;
        printf("File %s: \n", fn);
        printf("   inode %ld\n", statbuf.st_ino);
        printf("  length %ld\n", len);

        if (S_ISREG(statbuf.st_mode)) {
                fd = open(fn, O_RDONLY);
                if (fd == -1) {
                        report_error(strerror(errno));
                }
                data = (char *) mmap(NULL, len,
                                     PROT_READ, MAP_SHARED, fd, 0);
                if (data == NULL) {
                        report_error(strerror(errno));
                }

                count = 0;
                for (i=0; i<len; i++) {
                        if (data[i] == 'a') {
                                count++;
                        }
                }
                close(fd);

                printf(" a count %ld\n", count);
        }

        return 0;
}
