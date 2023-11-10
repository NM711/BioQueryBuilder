
interface TABLE_USERS {
  user_id: number
  username: string
  email: string
  password_hash: string
}
 
interface TABLE_POSTS {
  post_id: number
  user_id: number
  title: string
  content: string
  created_at: string | Date
}
 
interface DATABASE {
  users: TABLE_USERS
  posts: TABLE_POSTS

}
 
 export default DATABASE