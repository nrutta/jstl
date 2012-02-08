import sys
import re

func_start = re.compile("^jstl")
func_end   = re.compile("^\}\)\(\)\;")

def process(file):
    fname = file.split('/')[-1]
    f = open(file)
    j = open("%s/%s" % ('requirejs', fname), 'w')
    for line in f:
        if func_start.match(line):
            j.write("define( function() {")
        elif func_end.match(line):
            j.write("});")
        else:
            j.write(line)

    f.close()
    j.close()



sys.argv.pop(0)
for arg in sys.argv:
    process(arg)



