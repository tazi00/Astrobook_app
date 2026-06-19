import { MOCK_POSTS } from '@/src/mock/data';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AstrologerPostsScreen() {
  const [posts] = useState(MOCK_POSTS.filter(p => p.astrologerId === 'astro_001'));
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState('');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Posts</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowCreate(!showCreate)}>
          <Text style={styles.addBtnText}>{showCreate ? '✕ Cancel' : '+ Create Post'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Create Post */}
        {showCreate && (
          <View style={styles.createCard}>
            <Text style={styles.createTitle}>Create New Post</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Share your cosmic wisdom..."
              placeholderTextColor="#4A4468"
              value={newPost}
              onChangeText={setNewPost}
              multiline
              numberOfLines={4}
            />
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaBtn}>
                <Text style={styles.mediaBtnText}>📷 Add Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaBtn}>
                <Text style={styles.mediaBtnText}>🎥 Add Video</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.publishBtn}>
              <Text style={styles.publishBtnText}>Publish Post 🚀</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Posts List */}
        <Text style={styles.sectionTitle}>Published Posts ({posts.length})</Text>
        {posts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: post.bgColor }]}>
            <Text style={styles.postContent} numberOfLines={3}>{post.content}</Text>
            <View style={styles.postFooter}>
              <View style={styles.postStats}>
                <Text style={styles.postStat}>👍 {post.likes}</Text>
                <Text style={styles.postStat}>💬 {post.comments}</Text>
                <Text style={styles.postStat}>↗ {post.shares}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#080617' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#F5ECD7' },
  addBtn: { backgroundColor: '#C9A84C', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { color: '#080617', fontWeight: '800', fontSize: 13 },
  content: { padding: 16, gap: 12 },
  createCard: { backgroundColor: '#0F0D22', borderRadius: 16, padding: 16, gap: 12, borderWidth: 1, borderColor: '#C9A84C' },
  createTitle: { fontSize: 15, fontWeight: '800', color: '#F5ECD7' },
  textInput: { backgroundColor: '#1E1B38', borderRadius: 12, padding: 14, color: '#F5ECD7', fontSize: 14, minHeight: 100, textAlignVertical: 'top' },
  mediaButtons: { flexDirection: 'row', gap: 10 },
  mediaBtn: { flex: 1, backgroundColor: '#1E1B38', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  mediaBtnText: { color: '#F5ECD7', fontSize: 13 },
  publishBtn: { backgroundColor: '#C9A84C', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  publishBtnText: { color: '#080617', fontWeight: '800', fontSize: 14 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#F5ECD7' },
  postCard: { borderRadius: 14, padding: 16, gap: 12 },
  postContent: { color: '#FFF', fontSize: 14, lineHeight: 22 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  postStats: { flexDirection: 'row', gap: 12 },
  postStat: { color: '#FFFFFFCC', fontSize: 12 },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 18 },
});
