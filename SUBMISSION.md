# Submission

## Platform Requirements
* Node v10 or later
* Yarn v1.16 or later

## Notes
Please run `/bin/run` before you you run tests

## My Approach

The way I look at it, this is a very typical problem that is best solved with a relational database system. I didn't want to create too many dependencies and make things too heavy, plus I only need very basic seeding and join functionalities for this test's scope, so SQLite is perfect for this task.

My approach to the problem is simple. First, I model all the data sources (`accounts.json`, `amazecom.json` and `wondertel.json`) into 3 database objects: Accounts, Grants and Revocations, then I combine all the information that was provided with an `INNER JOIN`. I don't know if we were expected to to combine the data in the server language, but SQLite and other DB engines are very optimized for this workflow and purpose and I don't think we can do better while keeping resource usage efficient especially when the number of entries increase considerably.

Once I've combined the data with SQL, I process the grants and revocations for every account in Node. This logic most probably could've been done in SQL as well, but it would be very clunky to write and comepletely unnecessary. Once that's done the ouput is formatted and written into the `result.json` as instructed.

If you checked my Git history, you may have noticed I initially wrote everything in Node 12 experimental modules, but I later rewrote everything to just use CJS because Jest, Knex and most NPM libraries don't support ES Modules natively and getting them to play nicely together quickly took more effort than working on this project itself. The goal is to avoid transpiling server code altogether but at the current moment this feels like a distant goal.
