INSERT INTO `kn-cathungtinh-canchi` (`Id`, `Thang`, `Id_canchi`, `Id_cathungtinh`) VALUES 
(NULL, '1', '51', '22'), 
(NULL, '2', '52', '22'), 
(NULL, '3', '41', '22'), 
(NULL, '4', '54', '22'), 
(NULL, '5', '43', '22'), 
(NULL, '6', '44', '22'), 
(NULL, '7', '57', '22'), 
(NULL, '8', '58', '22'), 
(NULL, '9', '47', '22'), 
(NULL, '10', '60', '22'), 
(NULL, '11', '49', '22'), 
(NULL, '12', '50', '22');



INSERT INTO `kn-cathungtinh-chi` (`Id`, `Thang`, `Id_chi`, `Id_cathungtinh`) VALUES 
(NULL, '1', '11', '38'), 
(NULL, '2', '1', '38'), 
(NULL, '3', '3', '38'), 
(NULL, '4', '5', '38'), 
(NULL, '5', '7', '38'), 
(NULL, '6', '9', '38'), 
(NULL, '7', '11', '38'), 
(NULL, '8', '1', '38'), 
(NULL, '9', '3', '38'), 
(NULL, '10', '5', '38'), 
(NULL, '11', '7', '38'), 
(NULL, '12', '9', '38');

(NULL, '1', '11', '147'), 
(NULL, '2', '1', '147'), 
(NULL, '3', '3', '147'), 
(NULL, '4', '5', '147'), 
(NULL, '5', '7', '147'), 
(NULL, '6', '9', '147'), 
(NULL, '7', '11', '147'), 
(NULL, '8', '1', '147'), 
(NULL, '9', '3', '147'), 
(NULL, '10', '5', '147'), 
(NULL, '11', '7', '147'), 
(NULL, '12', '9', '147');

(NULL, '1', '11', '119'), 
(NULL, '2', '1', '119'), 
(NULL, '3', '3', '119'), 
(NULL, '4', '5', '119'), 
(NULL, '5', '7', '119'), 
(NULL, '6', '9', '119'), 
(NULL, '7', '11', '119'), 
(NULL, '8', '1', '119'), 
(NULL, '9', '3', '119'), 
(NULL, '10', '5', '119'), 
(NULL, '11', '7', '119'), 
(NULL, '12', '9', '119');



update `cathungtinh` set 
`Thang1_Chi`=null,
`Thang2_Chi`=null,
`Thang3_Chi`=null,
`Thang4_Chi`=null,
`Thang5_Chi`=null,
`Thang6_Chi`=null,
`Thang7_Chi`=null,
`Thang8_Chi`=null,
`Thang9_Chi`=null,
`Thang10_Chi`=null,
`Thang11_Chi`=null,
`Thang12_Chi`=null
where Id =37 or Id =147 or Id =119


select B.Thang, A.*, C.Ten from cathungtinh A
join `kn_cathungtinh_chi` B on A.Id = B.Id_cathungtinh 
join `chi` C on B.Id_chi = C.id 
WHERE B.Thang =4 and C.Ten ='Tỵ' 
UNION ALL 

select D.Thang, A.*,E.Ten from cathungtinh A 
join `kn_cathungtinh_truc` D on A.Id = D.Id_cathungtinh 
join `truc` E on D.Id_truc = E.id 
WHERE D.Thang =4 and E.Ten ='Kiến' 
UNION ALL

select F.Thang, A.*,G.Ten from cathungtinh A 
join `kn_cathungtinh_can` F on A.Id = F.Id_cathungtinh 
join `can` G on F.Id_can = G.Id 
WHERE F.Thang =4 and G.Ten ='Tân' 
UNION ALL 

select H.Thang, A.*,K.Ten from cathungtinh A 
join `kn_cathungtinh_canchi` H on A.Id = H.Id_cathungtinh 
join `canchi` K on H.Id_canchi = K.Id 
WHERE H.Thang =4 and K.Ten ='Tân Tỵ' 