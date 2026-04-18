import { supabase } from './supabase';
import { db, type Verb } from './db';

export const syncWithCloud = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // 1. Pull Master Verbs from Cloud
    const { data: cloudVerbs } = await supabase.from('verbs').select('*');
    if (cloudVerbs) {
      console.log(`Menyinkronkan ${cloudVerbs.length} leksikon dari cloud...`);
      for (const v of cloudVerbs) {
        await db.verbs.put({
          id: v.id,
          root: v.root,
          past: v.past,
          present: v.present,
          wazan: v.wazan,
          translationId: v.translation || v.translation_id,
          type: v.type || 'shahih',
          forms: v.forms,
          examples: v.examples,
          isFavorite: v.is_favorite || false,
          createdAt: v.created_at ? new Date(v.created_at).getTime() : Date.now()
        });
      }
    }

    // 2. Pull Favorites from Cloud
    const { data: cloudFavs } = await supabase
      .from('user_favorites')
      .select('verb_id')
      .eq('user_id', user.id);

    if (cloudFavs) {
      const favIds = cloudFavs.map(f => f.verb_id);
      for (const id of favIds) {
        await db.verbs.update(id, { isFavorite: true });
      }
    }

    // 3. Pull Progress from Cloud
    const { data: cloudProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (cloudProgress) {
      for (const p of cloudProgress) {
        const local = await db.progress.where('verbId').equals(p.verb_id).first();
        if (!local || local.lastPracticed < new Date(p.last_practiced).getTime()) {
          await db.progress.put({
            verbId: p.verb_id,
            score: p.score,
            attempts: p.attempts,
            lastPracticed: new Date(p.last_practiced).getTime()
          });
        }
      }
    }

    console.log('Sync Complete');
  } catch (error) {
    console.error('Sync Error:', error);
  }
};

export const pushFavoriteToCloud = async (verbId: number, isFavorite: boolean) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (isFavorite) {
    await supabase.from('user_favorites').upsert({ user_id: user.id, verb_id: verbId });
  } else {
    await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('verb_id', verbId);
  }
};

export const pushProgressToCloud = async (verbId: number, score: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('verb_id', verbId)
    .single();

  const attempts = (existing?.attempts || 0) + 1;

  await supabase.from('user_progress').upsert({
    user_id: user.id,
    verb_id: verbId,
    score: score,
    attempts: attempts,
    last_practiced: new Date().toISOString()
  });
};
