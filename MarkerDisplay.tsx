import React, { useState } from 'react';
import { MarkerData } from './Map';
import { Card, DataTable, Paragraph, Provider as PaperProvider, Subheading, Title } from 'react-native-paper';
import { ImageSourcePropType, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { MaterialIcons } from '@expo/vector-icons';

interface IMarkerDisplayProps {
  marker: MarkerData
}

const MarkerDisplay: React.FunctionComponent<IMarkerDisplayProps> = ({ marker }) => {
  const deviceHeight = useWindowDimensions().height;
  const [page, setPage] = useState(1);

  const imgSources: Record<string,ImageSourcePropType> = {
    "./assets/turban_outfitters.png": require("./assets/turban_outfitters.png"),
    "./assets/loin_king.jpg": require("./assets/loin_king.jpg"),
    "./assets/bb_gun_shop.png": require("./assets/bb_gun_shop.png"),
    "./assets/saks.png": require("./assets/saks.png")    
  }

  const mainColor = "#00d6d6";

  return (
    <PaperProvider>
      <View style={styles.contentContainer}>
        
        <View style={styles.heroCard}>
          <Card>
            <Card.Cover source={imgSources[marker!.imageURI]}/>
            <Card.Title 
              title={marker!.name}
              right={(props) => (
                <Rating
                  readonly
                  startingValue={marker!.rating}
                />
              )}
            />
            <Card.Content>
              <Subheading>{marker!.description}</Subheading>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.linksCard}>
          <Card>
            <Card.Title 
              title={marker!.info}
              titleStyle={styles.linksFont}
              left={(props) => ( <MaterialIcons color={mainColor} name='info' size={20}/> )}
            />
          </Card>
        </View>

        <View style={styles.linksCard}>
          <Card>
            <Card.Title 
              title={marker!.address}
              titleNumberOfLines={2}
              titleStyle={styles.linksFont}
              left={(props) => ( <MaterialIcons color={mainColor} name='location-city' size={20}/> )}
            />
          </Card>
        </View>

        <View style={styles.linksCard}>
          <Card>
            <Card.Title 
              title=''
              titleStyle={styles.linksFont}
              subtitle='Reviews'
              left={(props) => ( <MaterialIcons color={mainColor} name='comment' size={20}/> )}
            />
            <Card.Content style={styles.indentation}>
              <Subheading>{marker!.review}</Subheading>
              <Paragraph style={styles.italicAlignRight}>{`- ${marker!.reviewer}`}</Paragraph>
            </Card.Content>
          </Card>
        </View>
        
        <View style={styles.datatable}>
          <DataTable>
          
            <DataTable.Header>
              <DataTable.Title>Products</DataTable.Title>
              <DataTable.Title>Size</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
            </DataTable.Header>
          
            {marker!.products.map((p) => (
              <DataTable.Row key={p.name}>
                <DataTable.Cell>{p.name}</DataTable.Cell>
                <DataTable.Cell>{p.size}</DataTable.Cell>
                <DataTable.Cell>{p.price}</DataTable.Cell>
              </DataTable.Row>

            ))}

            <DataTable.Pagination 
              page={page}
              numberOfPages={2}
              onPageChange={page => setPage(page)}
              label={`Page ${page} of 2`}
            />
          
          </DataTable>
        </View>

      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    width: '100%'
  },
  linksCard: {
    width: '100%',
    marginBottom: 10
  },
  linksFont: {
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: 16
  },
  indentation: {
    alignSelf: 'center',
    width: '70%'
  },
  italicAlignRight: {
    fontStyle: 'italic',
    alignSelf: 'flex-end'
  },
  datatable: {
    width: '100%'
  }
})

export default MarkerDisplay;
