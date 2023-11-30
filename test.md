import { ObjectId } from "mongodb";

const processedDocs = [
  {
    _id: new ObjectId("65337e4edb8c5e236ac54a3c"), //SP1
    content: 'Cua Thịt Cà Mau là loại cua nổi tiếng ở nước ta. Cua được Đảo Hải Sản thu mua chính gốc tại Cà Mau...'
  },
  {
    _id: new ObjectId("653385dbdb8c5e236ac54dbf"), //SP2
    content: 'Cua Gạch cà Mau  Cua Gạch cà Mau là loại cua nổi tiếng ở nước ta. Cua được Đảo Hải Sản thu mua...'
  },
  {
    _id: new ObjectId("65338bfadb8c5e236ac5507a"), //SP3
    content: 'Tôm sú sống là một lựa chọn được rất nhiều người tiêu dùng yêu thích và đưa vào các bữa ăn hằng...'
  },
  {
    _id: new ObjectId("6533d0ad62aa43bfee2065b5"), //SP4
    content: 'Tôm Khô Tiện Lợi Tôm khô tiện lợi dễ dùng dễ bảo quản, thích hợp chế biến với nhiều món khác...'
  },
  {
    _id: new ObjectId("6533d1b262aa43bfee206656"), //SP5
    content: 'Tôm thẻ tươi sống là một loại tôm biển được nuôi trong môi trường nước ngọt hoặc nước mặn, tùy...'
  },
  {
    _id: new ObjectId("6533d2bc62aa43bfee206707"), //SP6
    content: 'Đặc điểm của đầu cá hồi Đầu cá hồi tuy chỉ là phụ phẩm của cá hồi tại Homefarm nhưng nếu biết...'
  },
  {
    _id: new ObjectId("653e126d7bef1e14bdc1338a"), //SP7
    content: 'Trước đây, nông dân Cà Mau chủ yếu nuôi tôm theo phương pháp quảng canh truyền thống, với các...'
  },
  {
    _id: new ObjectId("6551f272690946fe9c7ea8f5"), //SP8
    content: 'Tôm thẻ tươi sống là một loại tôm biển được nuôi trong môi trường nước ngọt hoặc nước mặn, tùy...'
  },
]

const documentVectors = [
  {
    id: ObjectId { Symbol(id): Buffer { } }, //SP1
  vector: Vector {
    vector: {
      cua: 37.03713493780799,
      ng: 27.776760835388345,
      th: 17.591948529079286,
      //...
    }
  }
  },
{
  id: ObjectId { Symbol(id): Buffer { } }, //SP2
  vector: Vector {
    vector: {
      cua: 21.786549963416462,
        ng: 16.666056501233005,
          th: 9.258920278462782,
        //...
      }
  }
},
{
  id: ObjectId { Symbol(id): Buffer { } }, //SP3
  vector: Vector {
    vector: {
      ng: 65.73833397708574,
        th: 26.850868807542064,
          nh: 26,
        //...
      }
  }
},
{
  id: ObjectId { Symbol(id): Buffer { } }, //SP4
  vector: Vector {
    vector: {
      kh: 2.777676083538834,
        ti: 2,
          nhau: 1.9555114450274365,
        //...
      }
  }
},
{
  id: ObjectId { Symbol(id): Buffer { } }, //SP5
  vector: Vector {
    vector: {
      ng: 69.44190208847085,
        th: 36.109789086004845,
          ch: 34.25800503031229,
        //...
      }
  }
},
{
  id: ObjectId { Symbol(id): Buffer { } }, //SP6
  vector: Vector {
    vector: {
      ng: 26.850868807542064,
        ch: 19.44373258477184,
          th: 13.888380417694172,
        //...
      }
  }
},
{
  id: ObjectId { Symbol(id): Buffer { } }, //SP7
  vector: Vector {
    vector: {
      ng: 17.591948529079286,
        cua: 8.714619985366586,
          ch: 8.333028250616502,
        //...
      }
  }
},
{
  id: ObjectId { Symbol(id): Buffer { } },  //SP8
  vector: Vector {
    vector: {
      ng: 69.44190208847085,
        th: 36.109789086004845,
          ch: 34.25800503031229,
        //...
      }
  }
}
]