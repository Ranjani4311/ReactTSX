
export const orderItems : any[]= [
  {
    abcd: 1,
    xyz: 'A',
    addd: 'Electronics',
    est: 250.75,
    barcode: '123456789012',
  },
  { abcd: 2, xyz: 'B', addd: 'Furniture', est: 520.5, barcode: '234567890123' },
  {
    abcd: 3,
    xyz: 'A',
    addd: 'Groceries',
    est: 150.25,
    barcode: '345678901234',
  },
  { abcd: 4, xyz: 'C', addd: 'Clothing', est: 320.8, barcode: '456789012345' },
  {
    abcd: 5,
    xyz: 'B',
    addd: 'Accessories',
    est: 410.0,
    barcode: '567890123456',
  },
];

export let employeeDetails = [
  {
      EmployeeID: 1, EvidenceLink: 'https//1234', TestResult: 'OK', Address: 'Chennai'
  },
  {
      EmployeeID: 2, EvidenceLink: 'https//1234', TestResult: 'NOT OK', Address: 'Bangalore'
  },
  {
      EmployeeID: 3, EvidenceLink: 'https//1234', TestResult: 'OK', Address: 'Cochin'
  },
  {
      EmployeeID: 4, EvidenceLink: 'https//1234', TestResult: 'OK', Address: 'Trivandrum'
  },
  {
      EmployeeID: 5, EvidenceLink: 'https//1234', TestResult: 'NOT OK', Address: 'Delhi'
  },
  {
      EmployeeID: 6, EvidenceLink: 'https//1234', TestResult: 'OK', Address: 'Chennai'
  },
 
];


const names = ['TOM', 'Hawk', 'Jon', 'Chandler', 'Monica', 'Rachel', 'Phoebe', 'Gunther', 'Ross',
    'Geller', 'Joey', 'Bing', 'Tribbiani', 'Janice', 'Bong', 'Perk', 'Green',
    'Ken', 'Adams'];
const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const designation = ['Manager', 'Engineer 1', 'Engineer 2', 'Developer', 'Tester'];
const status = ['Completed', 'Open', 'In Progress', 'Review', 'Testing'];
export function gridData(count:any) {
    const result = [];
    for (let i = 0; i < count; i++) {
        result.push({
            Designation: designation[Math.round(Math.random() * designation.length)] || designation[0],
            Engineer: names[Math.round(Math.random() * names.length)] || names[0],
            Estimation: hours[Math.round(Math.random() * hours.length)] || hours[0],
            Status: status[Math.round(Math.random() * status.length)] || status[0],
            TaskID: i + 1
        });
    }
    return result;
}
;

export let data: Object[] = [
  {
    OrderID: 10248,
    CustomerID: 'VINET',
    EmployeeID: 5,
    OrderDate: new Date("Jul 01 2001 00:00:00 GMT+0530"),
    ShipName: 'Vins et alcools Chevalier',
    ShipCity: 'Reims',
    ShipAddress: '59 rue de l Abbaye',
    ShipRegion: 'CJ',
    ShipPostalCode: '51100',
    ShipCountry: 'France',
    Freight: 32.38,
    Verified: !0,
  },
  {
    OrderID: 10249,
    CustomerID: 'TOMSP',
    EmployeeID: 6,
    OrderDate: new Date(836505e6),
    ShipName: 'Toms Spezialitäten',
    ShipCity: 'Münster',
    ShipAddress: 'Luisenstr. 48',
    ShipRegion: 'CJ',
    ShipPostalCode: '44087',
    ShipCountry: 'Germany',
    Freight: 11.61,
    Verified: !1,
  },
  {
    OrderID: 10250,
    CustomerID: 'HANAR',
    EmployeeID: 4,
    OrderDate: new Date(8367642e5),
    ShipName: 'Hanari Carnes',
    ShipCity: 'Rio de Janeiro',
    ShipAddress: 'Rua do Paço, 67',
    ShipRegion: 'RJ',
    ShipPostalCode: '05454-876',
    ShipCountry: 'Brazil',
    Freight: 65.83,
    Verified: !0,
  },
  {
    OrderID: 10251,
    CustomerID: 'VICTE',
    EmployeeID: 3,
    OrderDate: new Date(8367642e5),
    ShipName: 'Victuailles en stock',
    ShipCity: 'Lyon',
    ShipAddress: '2, rue du Commerce',
    ShipRegion: 'CJ',
    ShipPostalCode: '69004',
    ShipCountry: 'France',
    Freight: 41.34,
    Verified: !0,
  },
  {
    OrderID: 10252,
    CustomerID: 'SUPRD',
    EmployeeID: 4,
    OrderDate: new Date(8368506e5),
    ShipName: 'Suprêmes délices',
    ShipCity: 'Charleroi',
    ShipAddress: 'Boulevard Tirou, 255',
    ShipRegion: 'CJ',
    ShipPostalCode: 'B-6000',
    ShipCountry: 'Belgium',
    Freight: 51.3,
    Verified: !0,
  },
  {
    OrderID: 10253,
    CustomerID: 'HANAR',
    EmployeeID: 3,
    OrderDate: new Date(836937e6),
    ShipName: 'Hanari Carnes',
    ShipCity: 'Rio de Janeiro',
    ShipAddress: 'Rua do Paço, 67',
    ShipRegion: 'RJ',
    ShipPostalCode: '05454-876',
    ShipCountry: 'Brazil',
    Freight: 58.17,
    Verified: !0,
  },
  {
    OrderID: 10254,
    CustomerID: 'CHOPS',
    EmployeeID: 5,
    OrderDate: new Date(8370234e5),
    ShipName: 'Chop-suey Chinese',
    ShipCity: 'Bern',
    ShipAddress: 'Hauptstr. 31',
    ShipRegion: 'CJ',
    ShipPostalCode: '3012',
    ShipCountry: 'Switzerland',
    Freight: 22.98,
    Verified: !1,
  },
  {
    OrderID: 10255,
    CustomerID: 'RICSU',
    EmployeeID: 9,
    OrderDate: new Date(8371098e5),
    ShipName: 'Richter Supermarkt',
    ShipCity: 'Genève',
    ShipAddress: 'Starenweg 5',
    ShipRegion: 'CJ',
    ShipPostalCode: '1204',
    ShipCountry: 'Switzerland',
    Freight: 148.33,
    Verified: !0,
  },
  {
    OrderID: 10256,
    CustomerID: 'WELLI',
    EmployeeID: 3,
    OrderDate: new Date(837369e6),
    ShipName: 'Wellington Importadora',
    ShipCity: 'Resende',
    ShipAddress: 'Rua do Mercado, 12',
    ShipRegion: 'SP',
    ShipPostalCode: '08737-363',
    ShipCountry: 'Brazil',
    Freight: 13.97,
    Verified: !1,
  },
  {
    OrderID: 10257,
    CustomerID: 'HILAA',
    EmployeeID: 4,
    OrderDate: new Date(8374554e5),
    ShipName: 'HILARION-Abastos',
    ShipCity: 'San Cristóbal',
    ShipAddress: 'Carrera 22 con Ave. Carlos Soublette #8-35',
    ShipRegion: 'Táchira',
    ShipPostalCode: '5022',
    ShipCountry: 'Venezuela',
    Freight: 81.91,
    Verified: !0,
  },
  {
    OrderID: 10258,
    CustomerID: 'ERNSH',
    EmployeeID: 1,
    OrderDate: new Date(8375418e5),
    ShipName: 'Ernst Handel',
    ShipCity: 'Graz',
    ShipAddress: 'Kirchgasse 6',
    ShipRegion: 'CJ',
    ShipPostalCode: '8010',
    ShipCountry: 'Austria',
    Freight: 140.51,
    Verified: !0,
  },
  {
    OrderID: 10259,
    CustomerID: 'CENTC',
    EmployeeID: 4,
    OrderDate: new Date(8376282e5),
    ShipName: 'Centro comercial Moctezuma',
    ShipCity: 'México D.F.',
    ShipAddress: 'Sierras de Granada 9993',
    ShipRegion: 'CJ',
    ShipPostalCode: '05022',
    ShipCountry: 'Mexico',
    Freight: 3.25,
    Verified: !1,
  },
  {
    OrderID: 10260,
    CustomerID: 'OTTIK',
    EmployeeID: 4,
    OrderDate: new Date(8377146e5),
    ShipName: 'Ottilies Käseladen',
    ShipCity: 'Köln',
    ShipAddress: 'Mehrheimerstr. 369',
    ShipRegion: 'CJ',
    ShipPostalCode: '50739',
    ShipCountry: 'Germany',
    Freight: 55.09,
    Verified: !0,
  },
  {
    OrderID: 10261,
    CustomerID: 'QUEDE',
    EmployeeID: 4,
    OrderDate: new Date(8377146e5),
    ShipName: 'Que Delícia',
    ShipCity: 'Rio de Janeiro',
    ShipAddress: 'Rua da Panificadora, 12',
    ShipRegion: 'RJ',
    ShipPostalCode: '02389-673',
    ShipCountry: 'Brazil',
    Freight: 3.05,
    Verified: !1,
  },
  {
    OrderID: 10262,
    CustomerID: 'RATTC',
    EmployeeID: 8,
    OrderDate: new Date(8379738e5),
    ShipName: 'Rattlesnake Canyon Grocery',
    ShipCity: 'Albuquerque',
    ShipAddress: '2817 Milton Dr.',
    ShipRegion: 'NM',
    ShipPostalCode: '87110',
    ShipCountry: 'USA',
    Freight: 48.29,
    Verified: !0,
  },
];