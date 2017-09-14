## TODOs

* Relative paths in `server/index.js` should not have `dist/` in front, the
`dist` folder should be self contained. This is important for making the
production bundle work.
* ~~[Pre-process GraphQL ASTs](http://dev.apollodata.com/react/webpack.html) for
Apollo with webpack when bundling. This should decrease bundle size, as
`graphql-tag` is no longer required client side, and speed up client side
because client does not need to do AST processing.~~
* Switch to [preact](https://github.com/developit/preact) to decrease bundle
size. `preact-compat` should give us very little change. Maybe `preact-compat`
for production?
* Optional polyfills/fetch/Promise/assign/keys bundle for old browsers, so we
don't need to include it in main bundle. [Link](https://gist.github.com/davidgilbertson/6a66e05d6f193281a4c6b54d19acf3fd#file-optional-polyfill-js).
* Look into service workers. Just [this](https://hackernoon.com/10-things-i-learned-making-the-fastest-site-in-the-world-18a0e1cdf4a7#.54l8nvqy8)
article in general. Maybe because of `async`/`await` we can't just take it out?
* Can we change fonts to native ones? So we don't need external ones?
* Make the `import()` statements use our custom splits created by the
`CommonChunksPlugin`, so they don't bundle and load the parts of the vendor
library they use.
* Split CSS into modules that can load asynchronously. Take the non-minified
CSS theme we have, and split it. Load it with links separately, with the most
important modules linked first. Most important module would be body and navbar
stuff, rest loads in along the way. All this should be very cacheable.
* Consider using `nprogress` for things?
* Remove Redux dev tools from production code.
* Create actual endpoint for
```
{
    me {
        kitchen {
            dinnerclub(id: ID!)
        }
    }
}
```
* Optimize react rendering:
    * Better use life cycle for complex components to calculate stuff as 
    few times as possible
     * Use `recompose` library to make the simple functional components 
     pure.

## TODO features
* Fejl håndtering, hvis API afviser request
* ~~Kok forside~~
    * ~~Indkøb knap~~
    * ~~Måltid rettelse~~
    * ~~Antal deltagere~~
* ~~Dato detaljer~~
    * ~~Aflys/tilmeld deltagelse~~
    * ~~Tilmeld gæster~~
    * ~~Vis pris~~
    * Tilmeld
    * ~~Lås felter hvis madklub er blevet afholdt~~
    * ~~Lås felter ved indkøb~~
* ~~Kok dato detaljer~~
    * ~~Aflyse madklub~~
    * ~~Rette måltid~~
    * ~~Købt ind~~
    * ~~Indtast pris~~
    * ~~Tilmeld gæster~~
    * ~~Lås felter hvis madklub er blevet afholdt~~
    * ~~Lås felter ved indkøb~~
    * Aflysnings deadline skal deaktivere aflysningsfeltet
* Backend tilføjelser
    * ~~Deadline for aflysning af madklub, gemmes som minutter~~
    * ~~deadline for hvor tidligt man kan handle ind, gemmes i minutter~~
    * ~~Er priceloft verification~~
    * ~~DinnerClub belongsTo kitchen~~
    * ~~Inkluder gæster i prislofts beregninger~~
    * ~~Re-enable csrf_check for changeDinnerclub~~
    * ~~periods:~~
        * ~~Create in db with proper associations~~
        * ~~Create querying fields in graphql~~
        * ~~Create filtering options in graphql~~
        * ~~Create field in PeriodType displaying accounting information~~
        * ~~Create mutations:~~
            * ~~Kitchen admin should be able to create periods. Periods cannot
            overlap with other periods.~~
            * ~~Kitchen admin should be able to change periods, as long as they
            are not archived, and start/end date does not overlap with other
            periods.~~
            * ~~Periods should be able to be archived, if archived, should
                archive dinnerclubs and participations for that period.~~
                Maybe check period has ended? ~~Archived dinnerclubs and
                participations should be immutable~~
        * ~~Periods optional?~~
    * ~~`createDinnerclub` should incorporate `assume_attendance`~~
    * ~~`dinnerclub` should have `archived` field~~
    * ~~`changeDinnerclub` should be immutable when archived~~
    * ~~`participation` should have `archived` field~~
    * ~~`participate` should be immutable when archived~~
    * ~~change password, require old password, make new datatype which can 
    be optionally passed to MutableAccountType~~
    * Support image upload
* Madklubs indstillinger
    * perioder
    * ~~tidligst indkøb madklub~~
    * ~~senest aflysning af madklub~~
    * ~~slå deltagelse som udgangspunkt til og fra~~
    * ~~juster prisloft~~
    * ~~Sæt automatisk tidspunkt for madklub~~
    * ~~Indstil køkkens navn~~
    * Billed af køkken
* Madklubs indstillinger for admin
    * alle madklubs indstillinger
    * Opret ny bruger
    * Slet bruger
    * Overdrag admin til andet køkkenmedlem
* Bruger indstillinger
    * ~~navn~~
    * billed
    * ~~værelses nummer~~
    * ~~aktiv~~
    * ~~email~~
    * ~~kodeord~~
    * ~~Giv visuel respons ved success~~
* API editor
    * ~~Create graphiql at `/api_editor`~~
    * ~~API editor works with CSRF~~
    * Check for login, and inform in UI if not
    * Use a better logo
    * ~~Properly integrate in build process~~
* ~~REMOVE `apollo-client` depedency and only use `react-apollo`. Small 
change in client code is required. SSR needs some refactoring, but seems
simpler!~~

## Bugs

* When editing meal as cook in date detail, if we switch date the input
field and content stays. We must reset it when the date changes!
* Something wrong with `shopping_completed`... (Just think it is sqlite vs. postgres bug)
* when pulling account from graphql, have some sort of id. It confuses the cache and
creates errors...
* Apollo shitting the bed... Somehow pulling the other async components first
helps make calendar async component go through. Is it because of navbar query?
It fucked with the user settings query to... Make it fragment and lift the page to
one query? Maybe it cannot handle several concurrent queries, only queries run
sequentially?...
I think it has something to do with the navbar query, and it being overwritten.
Maybe the store should be explored?