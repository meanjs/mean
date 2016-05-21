<a name="0.5.0"></a>
## 0.5.0 (TBD)

* The Users collection's Email field index now uses the MongoDB [Sparse](https://docs.mongodb.org/manual/core/index-sparse/) option
* The User model's Email field is not required, and there are scenarios where you will have User documents that don't contain the Email field. In this case, without the Sparse option, you will get a unique constraint index exception thrown when an additional User document is saved without this field.
* If you are upgrading an existing MEANJS application, and have not changed this field, you will already have an existing index on the Email field of your Users collection. If this is the case, you will need to follow these steps for the `sparse` option to be applied.


1. Run the upgrade script from the root of your MEANJS application to drop the index: `node scripts/upgrade-users-sparse-index`
2. Restart your MEANJS application.

When your application starts back up, Mongoose will rebuild your Email field's index; now with the `sparse` option applied to it.
