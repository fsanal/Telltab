const { Post, esClient } = require('../../models/feedback_forum/Post');
var mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const mongoosastic = require('mongoosastic');

createPost = (req, res) => {
    const { forumID, bucketID, authorID, visibilityIDs, personaID, tagIDs, assignmentIDs,
        title, body, progress, requirementIDs, url } = req.body;
    let post = new Post(
        {
            title,
            forum: ObjectId(forumID),
            author: ObjectId(authorID),
            created: new Date(),
            numComments: 0,
            numVotes: 0
        }
    );
    if (url) post.url = url;
    if (body) post.body = body;
    if (bucketID) post.bucket = ObjectId(bucketID);
    if (visibilityIDs) {
        post.visibility = visibilityIDs.map(visibilityID => ObjectId(visibilityID))
    }
    if (personaID) post.persona = ObjectId(personaID);
    if (tagIDs) {
        post.tags = tagIDs.map(tagID => ObjectId(tagID));
    }
    if (assignmentIDs) {
        post.assignments = assignmentIDs.map(assignmentID => ObjectId(assignmentID));
    } 
    if (progress) post.progress = progress;
    if (requirementIDs) {
        post.requirements = requirementIDs.map(requirementID => ObjectId(requirementID));
    }
    post.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

getPost = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

/// What if the bucket is not in the forumID specified?

editPost = (req, res) => {
    const { id } = req.params;
    const { title, body, progress, forumID, bucketID, personaID, url } = req.body;
    let update = {};
    if (title) update.title = title;
    if (body) update.body = body;
    if (progress) update.progress = progress;
    if (forumID) update.forum = ObjectId(forumID);
    if (bucketID) update.bucket = ObjectId(bucketID); 
    if (personaID) update.persona = ObjectId(personaID);
    if (url) update.url = url
    Post.findByIdAndUpdate(id, {$set: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

deletePost = (req, res) => {
    const { id } = req.params;
    Post.findByIdAndRemove(id, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        post.remove((err) => {
            if (err) return res.json({ success: false, error: err });
        });
        return res.json(post);
    });
}



retrievePosts = (req, res) => {
    let { forumID, authorID, bucketID, personaID, 
        visibilityIDs, tagIDs, assignmentIDs, 
        sort, progress, limit, skip, search } = req.body;
    let query, aggregate;
    if ( search ) {
        esClient.search({
            index: 'posts',
            body:   {
                        "query": {
                            "bool": {
                                "should": [
                                    { "match": 
                                        { "title": 
                                            { "query": search,
                                              "fuzziness": "AUTO",
                                              "max_expansions": 10
                                            }
                                        }
                                    },
                                    { "match": 
                                        { "body": 
                                            { "query": search,
                                              "fuzziness": "AUTO",
                                              "max_expansions": 10
                                            }
                                        }
                                    }  
                                ] 
                            }
                        },
                    }
        }, (err, response, status) => {
            if (err) return res.json(err)
            idArr = response.hits.hits.map(hit => ObjectId(hit._id));   
            aggregate = Post.aggregate();
            aggregate.match({ _id : { $in: idArr }});
            aggregate.addFields({ ordering : { $indexOfArray : [ idArr, "$_id" ]}});
            if (forumID) aggregate.match({ forum : ObjectId(forumID) });
            if (authorID) aggregate.match({ author : ObjectId(authorID) });
            if (bucketID) aggregate.match({ bucket : ObjectId(bucketID) });
            //if (personaID) query.where('persona').equals(personaID);
            if (visibilityIDs) aggregate.match({ visibility : { $all: visibilityIDs.map(visibilityID => ObjectId(visibilityID)) }});
            if (tagIDs) aggregate.match({ tags : { $in: tagIDs.map(tagID => ObjectId(tagID)) }});
            if (assignmentIDs) aggregate.match({ assignments : { $all: assignmentIDs.map(assignmentID => ObjectId(assignmentID)) }});
            if (progress) aggregate.match({ progress: progress });
            if (limit) aggregate.limit(Number(limit));
            if (skip) aggregate.skip(Number(skip));
            aggregate.sort({ ordering : 1 });
            aggregate.exec( (err, posts) => {
                if (err) return res.json({success: false, error: err });
                return res.json(posts);
            });
        });
    } else {
        query = Post.find();
        if (forumID) query.where('forum').equals(forumID);
        if (authorID) query.where('author').equals(authorID);
        if (bucketID) query.where('bucket').equals(bucketID);
        //if (personaID) query.where('persona').equals(personaID);
        if (visibilityIDs) query.where('visibility').all(visibilityIDs);
        if (tagIDs) query.where('tags').all(tagIDs);
        if (assignmentIDs) query.where('assignments').all(assignmentIDs);
        if (progress) query.where('progress').equals(progress);
        if (limit) query.limit(Number(limit));
        if (skip) query.skip(Number(skip));
        query.exec( (err, posts) => {
            if (err) return res.json({success: false, error: err });
            return res.json(posts);
        });
    }
}

addVisibility = (req, res) => {
    const { id } = req.params;
    const { visibilityID } = req.body;
    let update = {};
    if (visibilityID) update.visibility = ObjectId(visibilityID);
    Post.findByIdAndUpdate(id, {$push: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

removeVisibility = (req, res) => {
    const { id } = req.params;
    const { visibilityID } = req.body;
    let update = {};
    if (visibilityID) update.visibility = ObjectId(visibilityID);
    Post.findByIdAndUpdate(id, {$pull: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}


addTag = (req, res) => {
    const { id } = req.params;
    const { tagID } = req.body;
    let update = {};
    if (tagID) update.tags = ObjectId(tagID);
    Post.findByIdAndUpdate(id, {$push: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

deleteTag = (req, res) => {
    const { id } = req.params;
    const { tagID } = req.body;
    let update = {};
    if (tagID) update.tags = ObjectId(tagID);
    Post.findByIdAndUpdate(id, {$pull: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

assignPost = (req, res) => {
    const { id } = req.params;
    const { userID } = req.body;
    let update = {};
    if (userID) update.assignments = ObjectId(userID);
    Post.findByIdAndUpdate(id, {$push: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

deassignPost = (req, res) => {
    const { id } = req.params;
    const { userID } = req.body;
    let update = {};
    if (userID) update.assignments = ObjectId(userID);
    Post.findByIdAndUpdate(id, {$pull: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

addRequirement = (req, res) => {
    const { id } = req.params;
    const { reqID } = req.body;
    let update = {};
    if (reqID) update.requirements = ObjectId(reqID);
    Post.findByIdAndUpdate(id, {$push: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

deleteRequirement = (req, res) => {
    const { id } = req.params;
    const { reqID } = req.body;
    let update = {};
    if (reqID) update.requirements = ObjectId(reqID);
    Post.findByIdAndUpdate(id, {$pull: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

//Custom Field methods

/*addCustomField = (req, res) => {
    const { id } = req.params;
    const object = JSON.parse(JSON.stringify(req.body)); //act as JSON for now, should have type as first element
    let update = {};
    if (object) update.customFields = object;
    Post.findByIdAndUpdate(id, {$push: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}

getCustomField = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post.customField);
    });
}

deleteCustomField = (req, res) => {
    const { id } = req.params;
    const { object } = req.body;
    let update = {};
    if (object) update.customField = customField;
    Post.findByIdAndUpdate(id, {$pull: update}, {new: true}, (err, post) => {
        if (err) return res.json({ success: false, error: err });
        return res.json(post);
    });
}*/




module.exports = { createPost, getPost, editPost, deletePost, 
    addVisibility, removeVisibility, addTag, deleteTag, addRequirement, 
    deleteRequirement, assignPost, deassignPost, retrievePosts }