// This helper function was made to generate Unique IDs
let sequenceDocument;
export default class UniqueID {
  // this function connects to the counters collection which holds the sequence_value (which is the unique ID)
  static async injectDB(conn) {
    if (sequenceDocument) {
      return;
    }
    try {
      sequenceDocument = await conn
        .db(process.env.STORIES_NS)
        .collection("counters");
    } catch (e) {
      console.error(`Unable to establish connection handle in UniqueID: ${e}`);
    }
  }

  // this function updates the sequence_value and returns the new value
  static async getNextSequenceValue(sequenceName) {
    try {
      // This will find the document with the sequenceName and increment the sequence_value by 1
      const result = await sequenceDocument.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false, upsert: true },
      );
      console.log(`result: ${result}`);
      return result.sequence_value;
    } catch (e) {
      console.error(`Unable to get next sequence value: ${e}`);
      console.error(e);
      return { error: e };
    }
  }
}