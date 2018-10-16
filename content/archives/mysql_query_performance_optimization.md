---
title: "MySQL Query Performance Optimization"
date: 2018-09-28T14:00:00-07:00
draft: false
featured_img: "mysql.png"
tags: ["sql", "databases"]
slug: "mysql-query-performance-optimization"
---

Its true that MySQL has performance limitations. However, for the majority of applications, MySQL's performance limitations never get reached. Unless tables have several hundred million rows, or the application is using MySQL for an unintended purpose (full-text search, heavy analytics, etc.) then any performance issues faced are probably self-imposed via poor indexing, architecture, query composition, or application logic.

Don't kick yourself for making any of these mistakes, as I've never met a developer who wasn't guilty of at least one of them.

## Storing BLOBs Inline
This is the cardinal sin for MySQL performance. The reason why BLOBs are so dangerous is because they can create a slow death sentence for the tables that contain them. The data for each BLOB is stored alongside the other row data on disk. This means that each row contains the standard data from each row AND the BLOB data. Even when using a LONGBLOB, which stores the data separately from other row data - the database still stores the BLOB prefix data (768 bytes) in the row. 

When the MySQL server scans this data, it has to load the data for every row it scans -- *even if that column is excluded in the query*. 

This structure works well enough, until tables start growing. At 50K rows -  querying the given table may not appear noticeably slower than usual. When a table hits 1M+ rows there will be a more noticeable slowdown - and the bigger the table gets - the more dramatic the performance hit. Indexes might help for a short period of time, but if the tables keep growing, you have only delayed the inevitable. 

At 1M+ rows pulling out your BLOBs, restructuring data, and any application logic associated with the given table will be about as much fun as chewing on a sheet of aluminum foil. Store BLOB data correctly up front.

Any solution that separates BLOBs from query-able data should work. One strategy could be to store each type of BLOB in it's own table, and store the primary key from the BLOB table along with query-able data. This costs another query - but prevents the transfer of excess BLOB data.

Another solution is to keep BLOB data out of the database entirely -- keep BLOBs in a specialized location such as file storage, or a dedicated document store. This adds a little bit of extra application code needed to access the BLOB data, but keeps the MySQL server free of clutter. 

Source: [https://stackoverflow.com/questions/9511476/speed-of-mysql-query-on-tables-containing-blob-depends-on-filesystem-cache](https://stackoverflow.com/questions/9511476/speed-of-mysql-query-on-tables-containing-blob-depends-on-filesystem-cache)

## Fetching Extra Data
This is probably the most common mistake made by new users of MySQL. The `SELECT * FROM table_name` query being the usual culprit. It's very convenient to use the wildcard selector but it is equally inefficient. Only select the columns needed for a given operation, as any data selected must be transferred from the server to the application. Those extra bytes may seem harmless - but as the tables grow they can quickly add up.

The same concept applies to fetching extra rows. If the application isn't going to use them, keep them out of the query. For example, when looking for the most recent records in a table, this query seems acceptable:

```sql
SELECT 
	widget_name, 
	price 
FROM 
	widgets 
WHERE 
	created_date >= DATE'yyyy-mm-dd'
```
However, MySQL will return the entire result set for this query. If the date chosen was especially busy the application could end up with far more results than desired. Always add a `LIMIT`
statement unless there is a good reason not to.

## Subqueries 
In most cases, subqueries (aka Nested Queries) will execute slower than an equivalent JOIN based query. The reasons are numerous and varied. The best way to tune subqueries for performance is to regularly test your application's subqueries against a JOIN based query that returns the same results to see which has the better execution plan using the [EXPLAIN statement](https://dev.mysql.com/doc/refman/8.0/en/using-explain.html).


## Using Multiple Queries
Contrary to the subqueries section above, its occasionally worth it to take a performance hit on a single query as opposed to trying to run multiple queries in a procedural fashion. This doesn't actually apply to MySQL, but rather to how applications typically connect to MySQL servers. 

Usually, an application connects to a MySQL server via a driver for the programming language used by the application. These drivers connect to the server and run queries by taking turns accessing a connection pool. What this means is that each query is essentially an individual request to a remote server. These requests carry their own overhead, which is separate from the actual query execution time. 

If you spot application code making a lot of small queries in a row, try combining them into a larger query and comparing the execution time with the initial application logic.


## Using MySQL Functions on Indexed Columns

Using functions in queries can render indexes virtually useless. The reason why is because the query is asking the database to make dynamic adjustments to the data at runtime. The result of the function is unknown to the database so every row must be scanned and checked. Instead of using functions, make conditionals explicit so that indexes aren't skipped over.

## No Indexing / Poor Indexing
Indexes are the key to storing and accessing large amounts of data in MySQL. Without indexes MySQL typically performs simple queries in an O(N) fashion. In this case, N is the size of the table being queried. When table sizes start growing, the time it takes to complete a query grows with it. 

An index operates like a cache by forming a B-Tree based on one or more columns. Essentially the data in a table is presorted according to the given column.  A properly planned index makes lookup time approach O(1). Rather  than reading, filtering, and sorting the data at query time - an index allows the MySQL server to retrieve the specific rows it needs without scanning the table.

No indexes are a common and easily corrected mistake. Poor indexes can be harder to troubleshoot. Usually, poor indexing occurs when there is a major change to application logic such as a major refactoring. It's best to profile queries from time to time and make sure that query performance is not degrading. In some cases queries themselves can cause an index to be skipped over, resulting in a full table scan. I can't cover all of the cases here - but [Markus Winand has an excellent, and in-depth guide on SQL performance and indexing.](https://use-the-index-luke.com/sql/table-of-contents)