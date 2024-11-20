import React from 'react';
import { View, StyleSheet, Image, Text, FlatList } from 'react-native';
import { NewReviewType } from './CafePage/CafeTypes';
import EmojiTag from './EmojiTag';

type Feed = {
  id: number;
  name: string;
  pfp?: string;
  action: 'rated' | 'revisted' | 'saved' | 'liked' | 'added' | string;
  cafe: string;
  location: string;
  date: string;
  review?: Partial<NewReviewType>;
};

interface FeedProps {
  feed: Feed;
}

export default function FeedComponent({ feed }: FeedProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
          {/*ADD ACTUAL PFP<Image source={{ uri: feed.pfp }} style={styles.avatar} />*/}
          <View style={styles.avatar}/>
          <View style={styles.headerText}>
            <Text style={styles.action}>
              <Text style={styles.userName}>{feed.name}</Text>{
              feed.action} <Text style={styles.placeName}>@ {feed.cafe}</Text>
            </Text>
            <Text style={styles.location}>{feed.location}</Text>
          </View>
          
      </View>
      
      {/* Review Content */}
      {feed.review && (
        <View style={styles.content}>
          {/* Description */}
          {feed.review.description && (
            <Text style={styles.reviewText}>{feed.review.description}</Text>
          )}

          {/* Images */}
          {feed.review.images && feed.review.images.length > 0 && (
            <View >
            {feed.review.images.map((imageUri, index) => (
              <Image 
                key={index} 
                source={{ uri: imageUri }} 
                style={styles.postImage} 
              />
            ))}
          </View>
          )}

          {/* Tags */}
          {feed.review.tags && (
            <View style={styles.tagContainer}>
              {feed.review.tags.map((tag, index) => (
                <EmojiTag key={index} tag={tag} />
              ))}
            </View>
          )}

          {/* Rating */}
          {feed.review.rating !== undefined && (
            <Text style={styles.date}>Rating: {feed.review.rating / 2} / 5</Text>
          )}
        </View>
      )}

      {/* Date */}
      <Text style={styles.date}>{feed.date}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    margin: 5,
    padding: 10,
    overflow: 'hidden',
    borderRadius: 15,
    flexShrink: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  avatar: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 999,
    marginRight: 10,
  },
  headerText: {
    padding: 2,
  },
  
  actionWrapper: {
    flex: 1,
    flexDirection: 'row',
    padding: 2,
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },

  action: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  
  placeName: {
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
  },

  location: {
    marginLeft: 60,
    fontSize: 12,
    color: '#999',
  },

  content:{

  },
  reviewText:{

  },
  postImage: {
    marginTop: 10,
    width: 126, 
    height: 103, 
    borderRadius: 10,
    margin: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },

  date: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
  },
});
