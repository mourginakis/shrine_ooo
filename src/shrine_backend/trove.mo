import Prelude   "mo:base/Prelude";
import HashMap   "mo:base/HashMap";
import Principal "mo:base/Principal";

// One day this will have to be an actor class to be able to scale
// actor class Trove () {
//     Prelude.nyi();
// };

module {


    // One day this will become an actor class for scaling
    public class Trove(title : Text, description: Text, tags : [Text], creationTime: Int) {
        var _title = title;
        var _description = description;
        var _tags = tags;
        var _creationTime = creationTime;

        let _accounts = HashMap.HashMap<Principal, Nat>(7, Principal.equal, Principal.hash);


        // getTitle
        public func getTitle() : Text {
            return _title;
        }
    };

    // getTitle (static)
    public func getTitle(trove : Trove) : Text {return trove.getTitle()};
};

