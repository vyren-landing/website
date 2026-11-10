/**
 * MVP public feed rules. Discussion reads are independent of whether new
 * Community sign-ups are open. Every real post stays hidden until reviewed.
 * No operational or protocol roles are granted by any feed entry.
 */
export const PUBLIC_TOPICS=Object.freeze([
  "GENERAL","TECHNOLOGY","CRYPTO","VYREN_QA","IDEAS"
]);
export function publicFeedEnabled(env){
 return env.CC_COMMUNITY_FEED_ENABLED==="true";
}
/** Restrict user input before the SQL query and never interpolate it into SQL. */
export function parsePublicFeedQuery(topicValue,pageValue) {
 const topic=topicValue===null||topicValue===""?null:topicValue;
 if(topic!==null&&!PUBLIC_TOPICS.includes(topic))return null;
 if(pageValue!==null&&!/^(0|[1-9][0-9]{0,2})$/.test(pageValue))return null;
 const page=pageValue===null?0:Number(pageValue);
 if(page>10)return null;
 return {topic,page,limit:15,offset:page*15};
}
/** For testing the public-only invariant separate from transport/server code. */
export function visibleToPublic(post) {
 return post?.visibility==="PUBLIC" &&
        post?.moderation_status==="APPROVED" &&
        post?.approved_at!=null;
}
