# trustpilot-white-rabbit

# Approach:
- read list of words (~100k entries) line by line and filter out words which contain characters that are not present in the anagram. Store valid words in a new array
- From the new array, filter out words which contain more characters than the anagram contains (e.g. count number of 'a' and check against the anagram number of 'a' - should be <=)
- At this point we have roughly ~1700 words eligible for solution
- Brute force xD: if three words have the same length as the anagram, check the hash of phrase  -> this finds easy & medium solutions

![image](https://user-images.githubusercontent.com/24357659/160830470-bf9693d2-a6a7-4745-9a72-11c402f383db.png)

# Notes regarding solution & optimizations:
- The hard phrase probably contains more than 3 words -> brute force becomes too inefficient
- Brute force is not an optimal solution, but it is a solution and the most obvious one
- Solution is written in Javascript (single threaded ☹️ ), however a better programming language could be chosen for efficiency purposes (C++/Java - using multithreading) or readability (Python)
- Another unorthodox solution would be to use Hashcat or similar tools against the given md5 hashes
- A more optimal solution would be to substract from the given anagram sets of three words from the already filtered list. If the substraction equals to 0 (>0 means there are characters unused in the candidate, <0 means not all characters from given anagram have been used in the candidate), permutate the candidate phrase -> 3! = 6 solutions, compute the hash for all 6 and check against the given hashes.
