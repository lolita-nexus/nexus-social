import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://wftbevggdyaufaelkbyw.supabase.co'
const supabaseAnonKey = 'sb_publishable_Rr-nBqv8yF_lX3V7Syu-Vw_ZeiNi6QQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function saveAllData(state) {
    try {
        for (const user of state.users) {
            await supabase.from('users').upsert(user, { onConflict: 'id' })
        }
        for (const post of state.posts) {
            await supabase.from('posts').upsert(post, { onConflict: 'id' })
        }
        for (const comment of state.comments) {
            await supabase.from('comments').upsert(comment, { onConflict: 'id' })
        }
        for (const like of state.likes) {
            await supabase.from('likes').upsert(like, { onConflict: 'id' })
        }
        for (const friend of state.friends) {
            await supabase.from('friends').upsert(friend, { onConflict: 'id' })
        }
        for (const notif of state.notifications) {
            await supabase.from('notifications').upsert(notif, { onConflict: 'id' })
        }
        for (const req of state.verificationRequests) {
            await supabase.from('verification_requests').upsert(req, { onConflict: 'id' })
        }
        for (const ban of state.bannedUsers) {
            await supabase.from('banned_users').upsert(ban, { onConflict: 'id' })
        }
    } catch (error) {
        console.error('Ошибка сохранения:', error)
    }
}

export async function loadAllData() {
    try {
        const [
            { data: users },
            { data: posts },
            { data: comments },
            { data: likes },
            { data: friends },
            { data: notifications },
            { data: verificationRequests },
            { data: bannedUsers }
        ] = await Promise.all([
            supabase.from('users').select('*'),
            supabase.from('posts').select('*'),
            supabase.from('comments').select('*'),
            supabase.from('likes').select('*'),
            supabase.from('friends').select('*'),
            supabase.from('notifications').select('*'),
            supabase.from('verification_requests').select('*'),
            supabase.from('banned_users').select('*')
        ])

        return {
            users: users || [],
            posts: posts || [],
            comments: comments || [],
            likes: likes || [],
            friends: friends || [],
            notifications: notifications || [],
            verificationRequests: verificationRequests || [],
            bannedUsers: bannedUsers || []
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error)
        return null
    }
}
