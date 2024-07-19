// LoadingSkeleton.js
import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CategorySkeleton = () => (
  <View style={styles.categorySkeleton}>
    <ContentLoader
      speed={2}
      width={wp(45)}
      height={hp(25)}
      viewBox={`0 0 ${wp(45)} ${hp(25)}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <Rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
    </ContentLoader>
  </View>
);

const BrandSkeleton = () => (
  <View style={styles.brandSkeleton}>
    <ContentLoader
      speed={2}
      width={wp(20)}
      height={hp(10)}
      viewBox={`0 0 ${wp(20)} ${hp(10)}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <Rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
    </ContentLoader>
  </View>
);

const ProductSkeleton = () => (
  <View style={styles.productSkeleton}>
    <ContentLoader
      speed={2}
      width={wp(90)}
      height={hp(30)}
      viewBox={`0 0 ${wp(90)} ${hp(30)}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <Rect x="0" y="0" rx="10" ry="10" width="100%" height="70%" />
      <Rect x="0" y={hp(23)} rx="5" ry="5" width="60%" height="10%" />
      <Rect x="0" y={hp(27)} rx="5" ry="5" width="40%" height="10%" />
    </ContentLoader>
  </View>
);

const styles = StyleSheet.create({
  categorySkeleton: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  brandSkeleton: {
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  productSkeleton: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export { CategorySkeleton, BrandSkeleton, ProductSkeleton };
