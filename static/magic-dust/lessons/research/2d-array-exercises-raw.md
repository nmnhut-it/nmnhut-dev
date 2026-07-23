# 2D Array / Matrix Exercise Research (raw) — 2026-07-07

Gathered for: 3 new "mảng hai chiều" islands, sourced from online course/exam problem sets.

## Source: w3resource — Python Array Exercises (https://www.w3resource.com/python-exercises/array/)
- [basic] Note: w3resource's dedicated `array/` index page is 1D-array-only (append/insert/reverse/count/duplicates). No 2D content found there directly — see the NumPy sub-index below and the conditional-exercise page for the one true 2D-generation exercise.
- [basic] Write a Python program that takes two digits m (row) and n (column) as input and generates a two-dimensional array; the element value in the i-th row and j-th column of the array should be i*j. (from `python-conditional-exercise-11.php`)

## Source: w3resource — NumPy Array Exercises (https://www.w3resource.com/python-exercises/numpy/index-array.php and linked pages)
- [basic] Create a 2-dimensional array of size 2 x 3, composed of integer elements.
- [basic] Create a 2-dimensional array of size 2 x 3, composed of 4-byte integer elements.
- [intermediate] Create a 2D array with 1 on the border and 0 inside.
- [intermediate] Create a 2-D array whose diagonal equals a given list of values and 0's elsewhere.
- [basic] Calculate the sum of all columns of a 2D NumPy array.
- [advanced] Compute the dot product of two arrays of different dimensions (1-D vs 2-D triggers matrix-vector multiplication; 2-D vs 2-D triggers matrix multiplication).

## Source: w3resource — Matrix Multiplication Using List Comprehensions (https://www.w3resource.com/python-exercises/advanced/matrix-multiplication-in-python-using-list-comprehensions.php)
- [advanced] Write a Python program to multiply two given matrices (represented as nested lists) using nested list comprehensions, without using any external library.

## Source: PYnative — 45 Python List Coding Exercises with Solutions (https://pynative.com/python-list-exercise-with-solutions/)
- [basic] Exercise 13 — Access Nested Lists (Simple Indexing): Given a "list of lists," access a specific item hidden inside the inner list — e.g. access the number 5 from `[[1, 2], [3, 4, 5], [6, 7]]`.
- [intermediate] Exercise 36 — Extend Nested List by Adding a Sublist: Write a function that iterates through a list of nested lists and appends a specific sublist/value to each inner list — e.g. append `"elderberry"` to each inner list of `[['apple', 'banana'], ['cherry', 'date']]`.
- [intermediate] Exercise 38 — Flatten Nested List (2D to 1D): Take a 2D list (a list containing several lists) and "flatten" it into a single 1D list containing all the individual elements in their original order — e.g. flatten `[[1, 2, 3], [4, 5], [6, 7, 8, 9]]`.
- [advanced] Exercise 39 — Flatten a Deeply Nested List (Recursion): Write a function that flattens a list of arbitrary depth; the list may contain integers or other lists, which in turn may contain even more lists — e.g. flatten `[1, [2, [3, 4], 5], 6, [7, 8]]`.
- [intermediate] Exercise 41 — Rotate a List: rotate list elements by a given number of positions (generalizes to rotating matrix rows).
- [intermediate] Exercise 42 — Split List into Chunks of Size N: reshape a flat list into equal-size chunks (relevant to building a 2D grid from a flat sequence).

## Source: PYnative — Python NumPy Exercise: 50 Practice Questions (https://pynative.com/python-numpy-exercise/)
- [basic] Convert 1D array to 2D — reshape a 1D array into a 2D array with 2 rows.
- [basic] Print Array Attributes — display shape, dimensions, and element size of a 2D array.
- [basic] Create a 3×3 NumPy array of all True values (a boolean matrix).
- [intermediate] Create a 4×4 array and extract its first row and last column.
- [intermediate] Extract Odd Rows and Even Columns from a 5×4 matrix via slicing.
- [intermediate] Slice the first two rows and first two columns from a 4×4 array (sub-matrix extraction).
- [intermediate] Sort a NumPy array based on a specific column (row-sort keyed by column values).
- [intermediate] Delete and insert a column in a NumPy array.
- [intermediate] Swap column 1 and column 2 in a 2D array.
- [intermediate] Create a 5×5 2D array with 1s on the border and 0s inside.
- [intermediate] Sort the rows of a 2D array based on the values of the second column.
- [advanced] Invert a matrix (compute the matrix inverse).
- [intermediate] Transpose a matrix.
- [advanced] Compute the eigenvalues and eigenvectors of a matrix.

## Source: GeeksforGeeks — Python Matrix (https://www.geeksforgeeks.org/python/python-matrix/)
- [basic] Creating a matrix with a "list of lists" — create a 3×4 matrix using nested Python lists.
- [basic] Take matrix input from the user in Python — accept row/column dimensions and matrix entries interactively.
- [basic] Create a matrix using list comprehension — generate a 4×4 matrix with values 0-3 using compact syntax.
- [basic] Replace a value at a specific position in a matrix (e.g. change the element at row 1, col 1).
- [intermediate] Modify matrix elements using negative indices (e.g. `x[-2][-1] = 21`).
- [intermediate] Add two 3×3 matrices element-wise using nested loops.
- [intermediate] Perform matrix addition and subtraction on two matrices using list comprehension.
- [intermediate] Perform element-wise multiplication and division of two matrices.
- [intermediate] Transpose a matrix using nested loops.
- [intermediate] Transpose a matrix using list comprehension.
- [basic] Generate a 3×3 matrix of random integers (NumPy).
- [intermediate] Perform basic math operations (add/subtract/multiply/divide) on matrices with NumPy.
- [advanced] Calculate dot and cross products of matrices/vectors.
- [intermediate] Slice a matrix to extract specific rows and columns.
- [intermediate] Delete a row from a matrix using `np.delete()`.
- [intermediate] Add new rows/columns to a matrix using stacking functions.

## Source: GeeksforGeeks — Coding Problems on Matrix Data Structure (https://www.geeksforgeeks.org/dsa/coding-problems-on-matrix-data-structure/)
- [intermediate] Rotate Matrix Elements (rotate the outer ring of elements).
- [intermediate] In-place rotate a square matrix by 90 degrees without using extra space.
- [advanced] Rotate a matrix by 90 degrees without using extra space (alternate approach).
- [intermediate] Rotate a matrix by 180 degrees.
- [advanced] Rotate each ring of a matrix anticlockwise by K elements.
- [intermediate] Turn/rotate an image (represented as a matrix) by 90 degrees.
- [advanced] Check if all rows of a matrix are circular rotations of each other.
- [intermediate] Sort all the elements of a given matrix.
- [basic] Find the row with the maximum number of 1s in a binary matrix.
- [advanced] Find the median in a row-wise sorted matrix.
- [advanced] Multiply two matrices using recursion.
- [intermediate] Write a program to multiply two matrices.
- [basic] Write a program for scalar multiplication of a matrix (multiply every element by a constant).
- [intermediate] Print the lower-triangular and upper-triangular parts of a matrix.
- [advanced] Find distinct elements that are common to all rows of a matrix.
- [advanced] Print a given matrix in spiral form.
- [basic] Find the maximum element of each row in a matrix.
- [intermediate] Find the unique elements in a matrix (elements that appear only once).
- [advanced] Shift matrix elements row-wise by k positions (circular shift).
- [intermediate] Swap the major and minor diagonals of a square matrix.
- [advanced] Find the maximum path sum in a matrix (path traversal DP).
- [basic] Compute the squares of a matrix's diagonal elements.
- [intermediate] Sum of the middle row and middle column in a matrix.
- [basic] Compare row-wise vs column-wise traversal of a matrix (print both ways).
- [advanced] Rotate a matrix to the right by K times.
- [intermediate] Interchange the elements of the first and last rows of a matrix.
- [advanced] Print a matrix in zig-zag fashion.
- [intermediate] Sort each row of a 2D array independently (row-wise sorting).
- [basic] Check whether a given matrix is an identity matrix.
- [intermediate] Check if a matrix is diagonal or a scalar matrix.
- [advanced] Sort a matrix both row-wise and column-wise.
- [advanced] Check whether a given matrix is a magic square.
- [advanced] Construct an even-order magic square.
- [basic] Find the boundary elements of a matrix.
- [advanced] Print a matrix in spiral form starting from a given point.
- [advanced] Print a matrix in snake/boustrophedon pattern.
- [intermediate] Interchange the two diagonals of a square matrix.
- [intermediate] Find the difference between the sums of the two diagonals of a matrix.
- [intermediate] Efficiently compute the sums of both diagonals of a matrix.
- [intermediate] Check if a given matrix is symmetric.
- [intermediate] Check if the sum of the i-th row equals the sum of the i-th column, for every i.
- [advanced] Find the maximum sum "hourglass" shape within a matrix.
- [basic] Find the maximum and minimum elements in a square matrix.
- [advanced] Print a matrix in reverse/anti-spiral form.
- [intermediate] Find the trace and normal of a matrix.
- [intermediate] Search for a value in a matrix that is sorted row-wise and column-wise.
- [advanced] Find the shortest distance between two cells in a matrix/grid.
- [intermediate] Count entries equal to a given value x in a specially structured matrix.
- [intermediate] Check whether a given matrix is sparse.
- [basic] Find the transpose of a matrix (basic loop implementation).
- [basic] Add two matrices.
- [basic] Subtract two matrices.

## Source: Snakify — Two-dimensional lists (arrays) lesson (https://snakify.org/en/lessons/two_dimensional_lists_arrays/)
- [basic] "Maximum" — find the maximum element in a 2D list.
- [intermediate] "Snowflake" — print a symmetric pattern using nested loops over a grid (classic grid-drawing exercise).
- [basic] "Chess board" — print/generate a chessboard pattern of alternating characters in a 2D grid.
- [intermediate] "The diagonal parallel to the main" — process/print the diagonal that runs parallel to the main diagonal of a square matrix.
- [intermediate] "Side diagonal" — process/print the secondary (anti-)diagonal of a square matrix.
- [intermediate] "Swap the columns" — swap two given columns of a matrix.
- [basic] "Scale a matrix" — multiply every element of a matrix by a given scalar.
- [advanced] "Multiply two matrices" — implement standard matrix multiplication for two given matrices.
- [basic, from lesson intro] Build a matrix where element `a[i][j] = i * j` for a given number of rows/columns (same pattern as the w3resource "generates a two-dimensional array" exercise, reused as the lesson's running example).

## Source: HackerRank — "2D Array - DS" problem (https://www.hackerrank.com/challenges/2d-array/problem)
- [advanced] Given a 6×6 2D array, calculate the sum of every possible "hourglass" shape within the array (7 cells: top row of 3, 1 middle cell, bottom row of 3) — there are 16 possible hourglasses in a 6×6 array — and print the maximum hourglass sum found.

## Source: Vietnamese — dainganxanh.com Python "Mảng 2 chiều" phụ lục (https://python.dainganxanh.com/phu-luc/mang-2-chieu)
- [intermediate] "Đọc dữ liệu từ file mang2.in và in ra màn hình mảng ma." (Read data from file mang2.in and print the array `ma` to the screen.)
- [intermediate] "Tính tổng đường chéo của mảng gồm m dòng đầu tiên của mảng ma." (Compute the sum of the diagonal of the sub-array consisting of the first m rows of array `ma`.)

## Source: Vietnamese — general summary from search results on "bài tập mảng 2 chiều python"
- [basic] Viết hàm tính tổng các phần tử của mảng 2 chiều. (Write a function to compute the sum of all elements of a 2D array.)
- [basic] Viết hàm đếm số các số hạng dương trong mảng 2 chiều. (Write a function to count the number of positive elements in a 2D array.)
- [basic] Tính trung bình cộng của các phần tử trong mảng 2 chiều. (Compute the average of the elements in a 2D array.)
- [intermediate] Tìm vị trí của phần tử âm đầu tiên trong mảng 2 chiều. (Find the position of the first negative element in a 2D array.)
- [intermediate] Tìm phần tử dương cuối cùng trong mảng 2 chiều. (Find the last positive element in a 2D array.)
- [basic] Tìm phần tử lớn nhất của mảng 2 chiều (danh sách các danh sách). (Find the maximum element of a 2D array / list of lists.)

## Source: Vietnamese — quantrimang.com "Ma trận trong Python" (https://quantrimang.com/hoc/ma-tran-trong-python-160014) and related search summary
- [basic] Khai báo và tạo ma trận bằng danh sách lồng nhau (list of lists) hoặc bằng thư viện NumPy. (Declare/create a matrix using nested lists or the NumPy library.)
- [intermediate] Phép cộng ma trận: cộng từng phần tử tương ứng của 2 ma trận cùng cấp với nhau. (Matrix addition: add corresponding elements of two same-size matrices.)
- [advanced] Phép nhân ma trận: nhân hai ma trận [A]mp và [B]pn khi số cột của A bằng số hàng của B, dùng `numpy.dot()`. (Matrix multiplication: multiply two matrices when the column count of A equals the row count of B, using `numpy.dot()`.)
- [intermediate] Phép chuyển vị: biến cột thành hàng và hàng thành cột của ma trận bằng `.transpose()`. (Transpose: convert columns to rows and rows to columns using `.transpose()`.)

## Summary tally
- Basic exercises found: 24
- Intermediate: 45
- Advanced: 19

(Total distinct exercise prompts gathered: 88, across 11 sources.)
