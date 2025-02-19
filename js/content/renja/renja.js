function open_modal_skpd(){
	window.rka_all = {};
	var body = '';
	show_loading();
	relayAjax({
		url: config.sipd_url+'api/renja/sub_bl/list_skpd',
		cache: true,
		type: 'POST',
		data: {
			id_daerah: _token.daerah_id,
			tahun: _token.tahun,
			limit: 10000
		},
		beforeSend: function (xhr) {
		    xhr.setRequestHeader("x-api-key", x_api_key());
			xhr.setRequestHeader("x-access-token", _token.token);
		},
		success: function(units){
			console.log('data', units.data);
			window.units_skpd = units.data;				
			// jika admin
			if(idunitskpd == 0){
				units.data.map(function(b, i){
					var keyword = b.id_skpd+'-'+b.id_unit;
					rka_all[keyword] = b;
					body += ''
						+'<tr>'								
							+'<td class="text-center"><input type="checkbox" value="'+keyword+'"></td>'
							+'<td>'+b.kode_skpd+' - '+b.nama_skpd+'</td>'
							+'<td>-</td>'								
						+'</tr>';
				});
				jQuery('#table-extension tbody').html(body);
				run_script('show_modal_sm');
				hide_loading();
			}else{
				var cek_skpd = false;
				units.data.map(function(b, i){
					if(b.id_skpd == idunitskpd){
						cek_skpd = b;
					}
				});
				if(cek_skpd){
					singkron_rka_ke_lokal_all(cek_skpd, function(){
	    				alert('Berhasil singkron data!');
						hide_loading();
	    			});
				}else{
					alert('Data SKPD tidak ditemukan!');
					hide_loading();
				}
			}
		}
	});
}

function singkron_skpd_modal(){
	var data_selected = [];
	jQuery('#table-extension tbody tr input[type="checkbox"]').map(function(i, b){
		var cek = jQuery(b).is(':checked');
		if(cek){
			var id = jQuery(b).val();
			data_selected.push(rka_all[id]);
		}
	});
	if(data_selected.length >= 1){
		console.log('data_selected', data_selected);
		if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
			singkron_all_unit(data_selected);
		}		
	}else{
		alert('Pilih data dulu!');
		// singkron_rka_ke_lokal_all(cek_unit);
	}
}

function open_modal_subgiat(idunit){	
	var body = '';
	// id_unit = opsi_unit.id_skpd ? opsi_unit.id_skpd : _token.unit;
	id_unit = idunit ? idunit : _token.unit;
	show_loading();
	relayAjax({
		url: config.sipd_url+'api/renja/sub_bl/list_belanja_by_tahun_daerah_unit',                                    
		type: 'POST',	      				
		data: {            
				id_daerah: _token.daerah_id,				
				tahun: _token.tahun,
				id_unit: id_unit
			},
		beforeSend: function (xhr) {			    
			xhr.setRequestHeader("X-API-KEY", x_api_key());
			xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
		},
		success: function(subkeg){
			console.log('list_belanja_by_tahun_daerah_unit');
			console.log('list bl', subkeg.data);
			window.sub_keg_skpd = subkeg.data;
			subkeg.data.map(function(b, i){
				if(
					b.sub_giat_locked == 0
					&& b.kode_sub_skpd
				){
					var keyword = b.kode_sbl;	
					// kode_sbl_all[keyword] = b;						
					body += ''
						+'<tr>'								
							+'<td class="text-center"><input type="checkbox" value="'+keyword+'"></td>'
							+'<td>'+b.nama_sub_giat+'</td>'
							+'<td>-</td>'								
						+'</tr>';
				}
			});
			jQuery('#table-extension tbody').html(body);
			run_script('show_modal_sm');
			hide_loading();
		}
	});
}

function singkron_subgiat_modal(){
	var data_sub_keg_selected = [];
	jQuery('#table-extension tbody tr input[type="checkbox"]').map(function(i, b){	
		if(jQuery(b).is(':checked') == true){
			var kode_sbl =  jQuery(b).val();
			sub_keg_skpd.map(function(bb, ii){
				if(bb.kode_sbl == kode_sbl){
					data_sub_keg_selected.push(bb);
				}
			});
		}			
	});
	if(data_sub_keg_selected.length == 0){
		alert('Pilih sub kegiatan dulu!');
	}else if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		console.log('data_sub_keg_selected', data_sub_keg_selected);
		var id_unit = _token.unit;
		var cat_wp = '';
		var last = data_sub_keg_selected.length-1;
		data_sub_keg_selected.reduce(function(sequence, nextData){
			return sequence.then(function(current_data){
				console.log('current_data data_sub_keg_selected', current_data);
				return new Promise(function(resolve_reduce, reject_reduce){
					if(
						current_data.sub_giat_locked == 0 
						&& current_data.kode_sub_skpd
					){
						cat_wp = current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd;
						var nama_skpd = current_data.nama_skpd.split(' ');
						nama_skpd.shift();
						nama_skpd = nama_skpd.join(' ');
						singkron_rka_ke_lokal({
							id_daerah: current_data.id_daerah,
							tahun: current_data.tahun,
							id_unit: current_data.id_unit,
							id_skpd: current_data.id_skpd,
							id_sub_skpd: current_data.id_sub_skpd,
							id_giat: current_data.id_giat,
							id_program: current_data.id_program,
							id_sub_giat: current_data.id_sub_giat,
							id_urusan: current_data.id_urusan,
							id_bidang_urusan: current_data.id_bidang_urusan,
							action: current_data.action,
							kode_bl: current_data.kode_bl,
							kode_sbl: current_data.kode_sbl,
							idbl: current_data.id_bl,
							idsubbl: current_data.id_sub_bl,
							kode_skpd: current_data.kode_skpd,
							nama_skpd: nama_skpd,
							kode_sub_skpd: current_data.kode_sub_skpd,
							nama_sub_skpd: current_data.nama_sub_skpd,
							pagumurni: current_data.pagumurni,
							pagu: current_data.pagu,
							no_return: true
						}, function(){
							console.log('next reduce', nextData);
							resolve_reduce(nextData);
						});
					}else{
						resolve_reduce(nextData);
					}
				})
				.catch(function(e){
					console.log(e);
					return Promise.resolve(nextData);
				});
			})
			.catch(function(e){
				console.log(e);
				return Promise.resolve(nextData);
			});
		}, Promise.resolve(data_sub_keg_selected[last]))
		.then(function(data_last){
			var opsi = { 
				action: 'get_cat_url',
				api_key: config.api_key,
				category : cat_wp
			};
			var data = {
				message:{
					type: "get-url",
					content: {
						url: config.url_server_lokal,
						type: 'post',
						data: opsi,
						return: true
					}
				}
			};
			chrome.runtime.sendMessage(data, function(response) {
				console.log('responeMessage', response);
			});
		})
		.catch(function(e){
			console.log(e);
		});
	}
}

function singkron_all_unit(units) {
	jQuery('#persen-loading').attr('persen', 0);
	jQuery('#persen-loading').html('0%');
	var last = units.length-1;
	jQuery('#persen-loading').attr('total', units.length);
	units.reduce(function(sequence, nextData){
        return sequence.then(function(current_data){
    		return new Promise(function(resolve_reduce, reject_reduce){				
				var c_persen = +jQuery('#persen-loading').attr('persen');
				c_persen++;
				jQuery('#persen-loading').attr('persen', c_persen);
				jQuery('#persen-loading').html(((c_persen/units.length)*100).toFixed(2)+'%'+'<br>'+current_data.nama_skpd);
				console.log('singkron_all_unit', current_data);
    			relayAjax({
					url: config.sipd_url+'api/master/skpd/view/'+current_data.id_skpd+'/'+current_data.tahun+'/'+current_data.id_daerah,			
                    type: 'GET',	      				
                    processData: false,
                    contentType : 'application/json',
                    beforeSend: function (xhr) {			    
                        xhr.setRequestHeader("X-API-KEY", x_api_key());
                        xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
                    },
					success: function(html){
                        console.log('html singkron_all_unit', html);
						// var kode_get = html.split('lru8="')[1].split('"')[0];
						// current_data.kode_get = kode_get;
            			singkron_rka_ke_lokal_all(current_data, function(){
            				console.log('next reduce singkron_all_unit', nextData);
							resolve_reduce(nextData);
            			});
            		}
            	});
			})
            .catch(function(e){
                console.log(e);
                return Promise.resolve(nextData);
            });
        })
        .catch(function(e){
            console.log(e);
            return Promise.resolve(nextData);
        });
    }, Promise.resolve(units[last]))
    .then(function(data_last){
    	var opsi = { 
			action: 'get_cat_url',
			type: 'ri',
			api_key: config.api_key,
			category : 'Semua Perangkat Daerah Tahun Anggaran '+_token.tahun
		};
		var data = {
		    message:{
		        type: "get-url",
		        content: {
				    url: config.url_server_lokal,
				    type: 'post',
				    data: opsi,
	    			return: true
				}
		    }
		};
		chrome.runtime.sendMessage(data, function(response) {
		    console.log('responeMessage', response);
		});
    })
    .catch(function(e){
        console.log(e);
    });
}

function singkron_rka_ke_lokal_all(opsi_unit, callback) {
	if((opsi_unit && opsi_unit.id_skpd) || confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		show_loading();
		console.log('singkron_rka_ke_lokal_all opsi_unit', opsi_unit);
		id_unit = opsi_unit.id_skpd;
		if(opsi_unit && opsi_unit.id_skpd){
			// script singkron pagu SKPD
			get_skpd(_token.tahun, _token.daerah_id, id_unit).then(function(skpd){
				get_pagu_validasi(_token.tahun, _token.daerah_id, id_unit).then(function(paguvalidasi){
					var opsi = { 
						action: 'set_unit_pagu',
						type: 'ri',
						api_key: config.api_key,
						tahun_anggaran: _token.tahun,
						data : {
							batasanpagu : paguvalidasi.data,
							id_daerah : _token.daerah_id,
							id_level : opsi_unit.id_level,
							id_skpd : opsi_unit.id_skpd,
							id_unit : opsi_unit.id_unit,
							id_user : opsi_unit.id_user,
							is_anggaran : opsi_unit.is_anggaran,
							is_deleted : opsi_unit.is_deleted,
							is_komponen : opsi_unit.is_komponen,
							is_locked : skpd.data[0].is_locked,
							is_skpd : skpd.data[0].is_skpd,
							kode_skpd : opsi_unit.kode_skpd,
							kunci_bl : opsi_unit.kunci_bl,
							kunci_bl_rinci : opsi_unit.kunci_bl_rinci,
							kuncibl : opsi_unit.kuncibl,
							kunciblrinci : opsi_unit.kunciblrinci,
							nilaipagu : opsi_unit.nilaipagu,
							nilaipagumurni : opsi_unit.nilaipagumurni,
							// nilairincian : opsi_unit.nilairincian,
							nilairincian : opsi_unit.rinci_giat,
							pagu_giat : opsi_unit.pagu_giat,
							realisasi : opsi_unit.realisasi,
							rinci_giat : opsi_unit.rinci_giat,
							set_pagu_giat : opsi_unit.set_pagu_giat,
							set_pagu_skpd : opsi_unit.set_pagu_skpd,
							tahun : opsi_unit.tahun,
							total_giat : opsi_unit.total_giat,					
							totalgiat : opsi_unit.totalgiat
						}
					};
					var data = {
						message:{
							type: "get-url",
							content: {
								url: config.url_server_lokal,
								type: 'post',
								data: opsi,
								return: false
							}
						}
					};
					chrome.runtime.sendMessage(data, function(response) {
						console.log('responeMessage', response);
					});
					if(jQuery('#only_pagu').is(':checked')){
						return callback();
					}
				})
			})
		}
		if(jQuery('#only_pagu').is(':checked')){
			return console.log('Hanya singkron pagu SKPD!');
		}

		if(typeof promise_nonactive == 'undefined'){
			window.promise_nonactive = {};
		}

		// get data belanja
		relayAjax({
			url: config.sipd_url+'api/renja/sub_bl/list_belanja_by_tahun_daerah_unit',                                    
			type: 'POST',	      				
			data: {            
				id_daerah: _token.daerah_id,				
				tahun: _token.tahun,
				id_unit: id_unit
			},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
			success: function(subkeg){
				console.log('list_belanja_by_tahun_daerah_unit', subkeg.data);
				// ubah status sub_keg_bl jadi tidak aktif semua agar jika ada sub keg yang dihapus, sipd lokal bisa ikut terupdate
				new Promise(function(resolve_reduce_nonactive, reject_reduce_nonactive){
					promise_nonactive[id_unit] = resolve_reduce_nonactive;
					var subkeg_aktif = [];
					subkeg.data.map(function(b, i){
						console.log('map',b);
						if(
							b.sub_giat_locked == 0
							&& b.kode_sub_skpd
						){
							subkeg_aktif.push({kode_sbl: b.kode_sbl});
						}
					});
					var data = {
					    message:{
					        type: "get-url",
					        content: {
							    url: config.url_server_lokal,
							    type: 'post',
							    data: {
							    	action: 'update_nonactive_sub_bl',
									type: 'ri',
									api_key: config.api_key,
									tahun_anggaran: _token.tahun,
									id_unit: id_unit,
									subkeg_aktif: subkeg_aktif
							    },
				    			return: true
							}
					    }
					};
					chrome.runtime.sendMessage(data, function(response) {
					    console.log('responeMessage', response);
					})
				}).then(function(){
					if(opsi_unit && opsi_unit.id_skpd){
						var cat_wp = '';
						var last = subkeg.data.length-1;
						console.log('subkeg', subkeg.data);
						subkeg.data.reduce(function(sequence, nextData){
							return sequence.then(function(current_data){
								return new Promise(function(resolve_reduce, reject_reduce){
									console.log('current_data subkeg', current_data);
									if(
										current_data.sub_giat_locked == 0 
										&& current_data.kode_sub_skpd
									){
										cat_wp = current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd;
										// var nama_skpd = current_data.nama_skpd.split(' ');
                                        var nama_skpd = current_data.nama_skpd;
										// nama_skpd.shift();
										// nama_skpd = nama_skpd.join(' ');
										singkron_rka_ke_lokal({
											id_daerah: id_daerah,
											tahun: tahun,
											id_unit: id_unit,
											id_skpd: current_data.id_skpd,
											id_sub_skpd: current_data.id_sub_skpd,
											id_giat: current_data.id_giat,
											id_program: current_data.id_program,
											id_sub_giat: current_data.id_sub_giat,
											id_urusan: current_data.id_urusan,
											id_bidang_urusan: current_data.id_bidang_urusan,
											action: current_data.action,
											kode_bl: current_data.kode_bl,
											kode_sbl: current_data.kode_sbl,
											idbl: current_data.id_bl,
											idsubbl: current_data.id_sub_bl,
											kode_skpd: current_data.kode_skpd,
											nama_skpd: nama_skpd,
											kode_sub_skpd: current_data.kode_sub_skpd,
											nama_sub_skpd: current_data.nama_sub_skpd,
											pagumurni: current_data.pagumurni,
											pagu: current_data.pagu,
											no_return: true
										}, function(){
											console.log('next reduce', nextData);
											resolve_reduce(nextData);
										});
									}else{
										resolve_reduce(nextData);
									}
								})
								.catch(function(e){
									console.log(e);
									return Promise.resolve(nextData);
								});
							})
							.catch(function(e){
								console.log(e);
								return Promise.resolve(nextData);
							});
						}, Promise.resolve(subkeg.data[last]))
						.then(function(data_last){
							if(callback){
								return callback();
							}else{
								var opsi = { 
									action: 'get_cat_url',
									api_key: config.api_key,
									category : cat_wp
								};
								var data = {
									message:{
										type: "get-url",
										content: {
											url: config.url_server_lokal,
											type: 'post',
											data: opsi,
											return: true
										}
									}
								};
								chrome.runtime.sendMessage(data, function(response) {
									console.log('responeMessage', response);
								});
							}
						})
						.catch(function(e){
							console.log(e);
						});
					}else{
						console.log('jika tidak ada  muncul data sub giat', subkeg.data);
						open_modal_subgiat(id_unit);
						// window.sub_keg_skpd = subkeg.data;
						// var body = '';
						// subkeg.data.map(function(b, i){
						// 	if(
						// 		b.sub_giat_locked == 0
						// 		&& b.kode_sub_skpd
						// 	){
						// 		var keyword = b.kode_sbl;	
						// 		rka_all[keyword] = b;						
						// 		body += ''
						// 			+'<tr>'								
						// 				+'<td class="text-center"><input type="checkbox" value="'+keyword+'"></td>'
						// 				+'<td>'+b.nama_sub_giat+'</td>'
						// 				+'<td>-</td>'								
						// 			+'</tr>';
						// 	}
						// });					
						// jQuery('#table-extension tbody').html(body);
						// run_script('show_modal_sm');
						// hide_loading();
					}
				});
			}		
		});
	}
}

function singkron_rka_ke_lokal(opsi, callback) {
	if((opsi && opsi.kode_bl) || confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		// show_loading();
		jQuery('#wrap-loading').show();
		// var id_unit = idune;
        console.log('singkron_rka_ke_lokal', opsi);
		var id_unit = opsi.id_skpd ? opsi.id_skpd : _token.unit;
		if(opsi && opsi.id_unit){
			id_unit = opsi.id_unit;
		}
		var kode_sbl = false;
		var kode_bl = false;
		var idbl = false;
		var idsubbl = false;
		var kode_skpd = false;
		var nama_skpd = false;
		var kode_sub_skpd = false;
		var pagu = 0;
		if(!opsi || !opsi.kode_bl){
			kode_sbl = kodesbl;
			var _kode_bl = kode_sbl.split('.');
			_kode_bl.pop();
			kode_bl = _kode_bl.join('.');
			idbl = kode_bl;
			idsubbl = kode_sbl;
		}else{
			kode_bl = opsi.kode_bl;
			kode_sbl = opsi.kode_sbl;
			idbl = opsi.idbl;
			idsubbl = opsi.idsubbl;
			kode_skpd = opsi.kode_skpd;
			nama_skpd = opsi.nama_skpd;
			kode_sub_skpd = opsi.kode_sub_skpd;
			pagu = opsi.pagu;
		}
		if((idbl && idsubbl) || kode_sbl){
			// get detail SKPD
			// tahun = opsi_unit.tahun;
			// id_daerah = opsi_unit.id_daerah;
			tahun = opsi.tahun;
			id_daerah = opsi.id_daerah;
			console.log('data opsi singkron_rka_ke_lokal', opsi);	
			sub_bl_view(idsubbl).then(function(sub_bl_view){
				console.log('sub_bl_view singkron_rka_ke_lokal', sub_bl_view);			
				get_skpd(tahun, id_daerah, id_unit).then(function(data_unit){
					console.log('get_skpd singkron_rka_ke_lokal', data_unit);
					// get_kode_from_rincian_page(opsi, kode_sbl).then(function(data_sbl){
					get_kode_from_rincian_page(opsi, kode_sbl).then(function(data_sbl){
						console.log('get_kode_from_rincian_page singkron_rka_ke_lokal', data_sbl);
						detil_lokasi_bl(idsubbl).then(function(detaillokasi){
							console.log('detaillokasi singkron_rka_ke_lokal', detaillokasi);
							capaian_bl(opsi.id_unit, opsi.id_skpd, opsi.id_sub_skpd, opsi.id_program, opsi.id_giat).then(function(capaian_bl){
								console.log('capaian_bl singkron_rka_ke_lokal', capaian_bl);
								dana_sub_bl(idsubbl).then(function(dana_sub_bl){	
									console.log('dana_sub_bl singkron_rka_ke_lokal', dana_sub_bl);				
									output_bl(idsubbl).then(function(output_bl){	
										console.log('output_bl singkron_rka_ke_lokal', output_bl);
										tag_bl(idsubbl).then(function(tag_bl){	
											console.log('tag_bl singkron_rka_ke_lokal', tag_bl);
											// label_bl(idsubbl).then(function(label_bl){	
											// 	console.log('label_bl singkron_rka_ke_lokal', label_bl);												
									
												if(opsi && opsi.action){
													// kode_get = opsi.action.split("detilGiat('")[1].split("'")[0];
													kode_get = opsi.id_sub_bl;
													data_sbl = { 
														data: {
															pagu : opsi.pagu,
															pagumurni : opsi.pagumurni,
															kode_sub_skpd : opsi.kode_sub_skpd,
															nama_sub_skpd : opsi.nama_sub_skpd
														}
													}
												}else{
													kode_get = data_sbl.url;
												}
												
												// get detail indikator kegiatan
												relayAjax({						
													// url: endog+'?'+kode_get,		
													url: config.sipd_url+'api/renja/output_giat/load_data',						
													type: 'POST',	      				
													data: {            
															tahun: _token.tahun,
															id_daerah: _token.daerah_id,												
															id_program: opsi.id_program,
															id_giat: opsi.id_giat,
															id_unit: opsi.id_unit,
															id_skpd: opsi.id_skpd,
															id_sub_skpd: opsi.id_sub_skpd,
														},
													beforeSend: function (xhr) {			    
														xhr.setRequestHeader("X-API-KEY", x_api_key());
														xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
													},						
													success: function(subkeg){
														console.log('output_giat singkron_rka_ke_lokal', subkeg.data);							
														var data_rka = { 
															action: 'singkron_rka',
															type: 'ri',
															tahun_anggaran: _token.tahun,
															api_key: config.api_key,
															rka : {},
															kode_skpd: kode_skpd,
															nama_skpd: nama_skpd,
															kode_sub_skpd: kode_sub_skpd,
															pagu: pagu,
															idbl: idbl,
															idsubbl: idsubbl,
															kode_bl: kode_bl,
															kode_sbl: kode_sbl,
															data_unit: {},
															dataBl: {},
															dataCapaian: {},
															dataDana: {},
															dataLb7: {},
															dataTag: {},
															dataEs3: {},
															dataHasil: {},
															dataOutput: {},
															dataLokout: {},
															dataOutputGiat: {},
														};
														if(!data_unit){
															data_rka.data_unit.kodeunit = data_sbl.data.kode_sub_skpd;
															data_rka.data_unit.namaunit = data_sbl.data.nama_sub_skpd;
														}else{
															for(var j in data_unit.data){
																data_rka.data_unit[j] = data_unit.data[j];
															}
														}
														console.log('data_unit', data_unit, data_rka.data_unit);
														subkeg.data.map(function(d, i){
															data_rka.dataOutputGiat[i] = {};
															data_rka.dataOutputGiat[i].id_giat = d.id_giat; //baru
															data_rka.dataOutputGiat[i].id_program = d.id_program; //baru
															data_rka.dataOutputGiat[i].id_skpd = d.id_skpd; //baru
															data_rka.dataOutputGiat[i].id_sub_skpd = d.id_sub_skpd; //baru
															data_rka.dataOutputGiat[i].id_unit = d.id_unit; //baru
															data_rka.dataOutputGiat[i].kode_renstra = d.kode_renstra; //baru
															data_rka.dataOutputGiat[i].kode_rpjm = d.kode_rpjm; //baru
															data_rka.dataOutputGiat[i].id_output_giat = d.id_output_giat; //baru
															data_rka.dataOutputGiat[i].outputteks = d.tolok_ukur;
															data_rka.dataOutputGiat[i].satuanoutput = d.satuan;
															data_rka.dataOutputGiat[i].targetoutput = d.target;
															data_rka.dataOutputGiat[i].targetoutputteks = d.target_teks;
														});
														detaillokasi.data.map(function(d, i){
															data_rka.dataLokout[i] = {};																		
															
															data_rka.dataLokout[i].idcamat = d.id_camat;
															data_rka.dataLokout[i].iddetillokasi = d.id_detil_lokasi;
															data_rka.dataLokout[i].idkabkota = d.id_kab_kota;
															data_rka.dataLokout[i].idlurah = d.id_lurah;									
															data_rka.dataLokout[i].id_sub_bl = d.id_sub_bl; //baru
															data_rka.dataLokout[i].tahun = d.tahun; //baru
															if(d.id_kab_kota != 0){
																get_view_daerah(d.id_kab_kota).then(function(daerah){	
																	console.log('daerah singkron_rka_ke_lokal', daerah.data);																
																	data_rka.dataLokout[i].daerahteks = daerah.data[0].nama_daerah;
																	if(d.id_camat != 0){
																		get_view_kecamatan(d.id_camat).then(function(kecamatan){
																			console.log('kecamatan singkron_rka_ke_lokal', kecamatan);	
																			data_rka.dataLokout[i].camatteks = kecamatan.data[0].camat_teks;
																			if(d.id_lurah != 0){
																				get_view_desa_kel(d.id_lurah).then(function(kelurahan){
																					console.log('kelurahan singkron_rka_ke_lokal', kelurahan.data);	
																					data_rka.dataLokout[i].lurahteks = kelurahan.data[0].lurah_teks;
																				});
																			}
																		});
																	}																
																});
															}
															else
															{
																get_view_daerah(_token.id_daerah).then(function(daerah){	
																	console.log('daerah singkron_rka_ke_lokal', daerah.data);																
																	data_rka.dataLokout[i].daerahteks = daerah.data[0].nama_daerah;
																	if(d.id_camat != 0){
																		get_view_kecamatan(d.id_camat).then(function(kecamatan){
																			console.log('kecamatan singkron_rka_ke_lokal', kecamatan);	
																			data_rka.dataLokout[i].camatteks = kecamatan.data[0].camat_teks;
																			if(d.id_lurah != 0){
																				get_view_desa_kel(d.id_lurah).then(function(kelurahan){
																					console.log('kelurahan singkron_rka_ke_lokal', kelurahan.data);	
																					data_rka.dataLokout[i].lurahteks = kelurahan.data[0].lurah_teks;
																				});
																			}
																		});
																	}																
																});
															}
														});

														capaian_bl.data.map(function(d, i){
															data_rka.dataCapaian[i] = {};
															data_rka.dataCapaian[i].satuancapaian = d.satuan;
															data_rka.dataCapaian[i].targetcapaianteks = d.target_teks;
															data_rka.dataCapaian[i].capaianteks = d.tolak_ukur;
															data_rka.dataCapaian[i].targetcapaian = d.target;
															data_rka.dataCapaian[i].id_capaian_bl = d.id_capaian_bl; //baru
															data_rka.dataCapaian[i].id_bl = d.id_bl; //baru
															data_rka.dataCapaian[i].id_unit = d.id_unit; //baru
															data_rka.dataCapaian[i].id_skpd = d.id_skpd; //baru
															data_rka.dataCapaian[i].id_sub_skpd = d.id_sub_skpd; //baru
															data_rka.dataCapaian[i].id_program = d.id_program; //baru
															data_rka.dataCapaian[i].id_giat = d.id_giat; //baru
															data_rka.dataCapaian[i].kode_rpjm = d.kode_rpjm; //baru
														});

														dana_sub_bl.data.map(function(d, i){
															data_rka.dataDana[i] = {};
															data_rka.dataDana[i].namadana = d.nama_dana;
															data_rka.dataDana[i].kodedana = d.kodedana;
															data_rka.dataDana[i].iddana = d.id_dana;
															data_rka.dataDana[i].iddanasubbl = d.id_dana_sub_bl;																					
															data_rka.dataDana[i].pagudana = d.pagu_dana;
															data_rka.dataDana[i].id_sub_bl = d.id_sub_bl; //baru	
														});

														//output sub giat
														output_bl.data.map(function(d, i){
															data_rka.dataOutput[i] = {};
															data_rka.dataOutput[i].outputteks = d.tolak_ukur;
															data_rka.dataOutput[i].targetoutput = d.target;
															data_rka.dataOutput[i].satuanoutput = d.satuan;
															data_rka.dataOutput[i].targetoutputteks = d.target_teks;
															data_rka.dataOutput[i].idoutputbl = d.id_output_bl;
															data_rka.dataOutput[i].tolok_ukur_sub = d.tolok_ukur_sub; //baru
															data_rka.dataOutput[i].target_sub = d.target_sub; //baru
															data_rka.dataOutput[i].target_sub_teks = d.target_sub_teks; //baru
															data_rka.dataOutput[i].satuan_sub = d.satuan_sub; //baru
															data_rka.dataOutput[i].id_sub_bl = d.id_sub_bl; //baru
															data_rka.dataOutput[i].id_unit = d.id_unit; //baru
															data_rka.dataOutput[i].id_skpd = d.id_skpd; //baru
															data_rka.dataOutput[i].id_sub_skpd = d.id_sub_skpd; //baru
															data_rka.dataOutput[i].id_program = d.id_program; //baru
															data_rka.dataOutput[i].id_giat = d.id_giat; //baru
															data_rka.dataOutput[i].id_sub_giat = d.id_sub_giat; //baru
														});
														if(tag_bl.data.length == 0){
															console.log('tag_bl belum diset pada sub kegiatan ini !');
														}else{
															tag_bl.data.map(function(d, i){
																data_rka.dataTag[i] = {};
																data_rka.dataTag[i].idlabelgiat = d.idlabelgiat;
																data_rka.dataTag[i].namalabel = d.namalabel;
																data_rka.dataTag[i].idtagbl = d.id_tag_bl;
															});
														}

														// subkeg.dataHasil.map(function(d, i){
														// 	data_rka.dataHasil[i] = {};
														// 	data_rka.dataHasil[i].hasilteks = d.hasilteks;
														// 	data_rka.dataHasil[i].satuanhasil = d.satuanhasil;
														// 	data_rka.dataHasil[i].targethasil = d.targethasil;
														// 	data_rka.dataHasil[i].targethasilteks = d.targethasilteks;
														// });

														// subkeg.dataEs3.map(function(d, i){

														// });
														
														// subkeg.dataLb7.map(function(d, i){

														// });

														// subkeg.dataBl.map(function(d, i){
														sub_bl_view.data.map(function(d, i){
															data_rka.dataBl[i] = {};															
															data_rka.dataBl[i].id_sub_bl = d.id_sub_bl;
															data_rka.dataBl[i].id_unik_sub_bl = d.id_unik;
															data_rka.dataBl[i].id_unit = d.id_unit; //baru
															data_rka.dataBl[i].id_skpd = d.id_skpd;
															data_rka.dataBl[i].id_sub_skpd = d.id_sub_skpd;
															data_rka.dataBl[i].id_pptk = d.id_pptk; //baru
															data_rka.dataBl[i].id_urusan_pusat = d.id_urusan_pusat; //baru
															data_rka.dataBl[i].id_bidang_urusan_pusat = d.id_bidang_urusan_pusat; //baru
															data_rka.dataBl[i].id_urusan = d.id_urusan;
															data_rka.dataBl[i].id_bidang_urusan = d.id_bidang_urusan;
															data_rka.dataBl[i].id_program = d.id_program;
															data_rka.dataBl[i].id_giat = d.id_giat;															
															data_rka.dataBl[i].id_bl = d.id_bl;
															data_rka.dataBl[i].id_sub_giat = d.id_sub_giat;
															data_rka.dataBl[i].no_program = d.no_program;
															data_rka.dataBl[i].no_giat = d.no_giat;
															data_rka.dataBl[i].no_sub_giat = d.no_sub_giat;
															data_rka.dataBl[i].pagu = d.pagu;
															// data_rka.dataBl[i].pagu = data_sbl.data.pagu;															
															data_rka.dataBl[i].id_dana = d.id_dana;
															data_rka.dataBl[i].id_lokasi = d.id_lokasi;
															data_rka.dataBl[i].waktu_awal = d.waktu_awal;
															data_rka.dataBl[i].waktu_akhir = d.waktu_akhir;
															data_rka.dataBl[i].pagu_indikatif = d.pagu_indikatif; //baru
															data_rka.dataBl[i].output_sub_giat = d.output_teks;															
															data_rka.dataBl[i].pagu_n2_lalu = d.pagu_n2_lalu; //baru
															data_rka.dataBl[i].pagu_n_lalu = d.pagu_n_lalu;
															data_rka.dataBl[i].pagu_n_depan = d.pagu_n_depan;
															data_rka.dataBl[i].pagu_n2_depan = d.pagu_n2_depan; //baru
															data_rka.dataBl[i].kunci_bl = d.kunci_bl; //baru
															data_rka.dataBl[i].kunci_bl_rinci = d.kunci_bl_rinci; //baru
															data_rka.dataBl[i].kunci_bl_akb = d.kunci_bl_akb; //baru
															data_rka.dataBl[i].rkpd_murni = d.rkpd_murni; //baru
															data_rka.dataBl[i].rkpd_pak = d.rkpd_pak; //baru
															// data_rka.dataBl[i].pagumurni = data_sbl.data.pagumurni;															
															data_rka.dataBl[i].pagumurni = d.rkpd_murni;
															data_rka.dataBl[i].nama_unit = d.nama_unit; //baru
															data_rka.dataBl[i].nama_skpd = d.nama_skpd; 
															data_rka.dataBl[i].nama_sub_skpd = d.nama_sub_skpd;
															data_rka.dataBl[i].nama_urusan = d.nama_urusan;
															data_rka.dataBl[i].nama_bidang_urusan = d.nama_bidang_urusan;
															data_rka.dataBl[i].nama_program = d.nama_program;
															data_rka.dataBl[i].nama_giat = d.nama_giat;
															data_rka.dataBl[i].nama_bl = d.nama_bl; //baru
															data_rka.dataBl[i].nama_sub_giat = d.nama_sub_giat;
															data_rka.dataBl[i].nama_pptk = d.nama_pptk; //baru
															data_rka.dataBl[i].nama_urusan_pusat = d.nama_urusan_pusat; //baru
															data_rka.dataBl[i].nama_bidang_urusan_pusat = d.nama_bidang_urusan_pusat; //baru
															data_rka.dataBl[i].nama_dana = d.nama_dana;
															data_rka.dataBl[i].nama_lokasi = d.nama_lokasi;
															data_rka.dataBl[i].kua_murni = d.kua_murni; //baru
															data_rka.dataBl[i].kua_pak = d.kua_pak; //baru
															data_rka.dataBl[i].kode_skpd = d.kode_skpd; 
															data_rka.dataBl[i].kode_urusan = d.kode_urusan;
															data_rka.dataBl[i].kode_urusan_pusat = d.kode_urusan_pusat; //baru
															data_rka.dataBl[i].kode_bidang_urusan = d.kode_bidang_urusan;
															data_rka.dataBl[i].kode_bidang_urusan_pusat = d.kode_bidang_urusan_pusat; //baru
															data_rka.dataBl[i].kode_program = d.kode_program;
															data_rka.dataBl[i].kode_giat = d.kode_giat;
															data_rka.dataBl[i].kode_sub_giat = d.kode_sub_giat;
															data_rka.dataBl[i].kode_dana = d.kode_dana; //baru
																														
															data_rka.dataBl[i].sasaran = d.sasaran;
															data_rka.dataBl[i].indikator = d.indikator;															
															data_rka.dataBl[i].satuan = d.satuan;
															data_rka.dataBl[i].id_rpjmd = d.id_rpjmd;		
															data_rka.dataBl[i].target_1 = d.target_1;
															data_rka.dataBl[i].target_2 = d.target_2;
															data_rka.dataBl[i].target_3 = d.target_3;
															data_rka.dataBl[i].target_4 = d.target_4;
															data_rka.dataBl[i].target_5 = d.target_5;
															var idunitsbl = d.id_unit;
															var idsubblbl = d.id_sub_bl;
															label_bl(d.id_sub_bl).then(function(labelbl){
																console.log('label_bl singkron_rka_ke_lokal', labelbl.data);	
																data_rka.dataBl[i].id_label_bl = labelbl.data[0].id_label_bl; //baru																																															
																data_rka.dataBl[i].id_label_kokab = labelbl.data[0].id_label_kokab;
																data_rka.dataBl[i].label_kokab = labelbl.data[0].label_kokab;
																data_rka.dataBl[i].id_label_pusat = labelbl.data[0].id_label_pusat;
																data_rka.dataBl[i].label_pusat = labelbl.data[0].label_pusat;
																data_rka.dataBl[i].id_label_prov = labelbl.data[0].id_label_prov;
																data_rka.dataBl[i].label_prov = labelbl.data[0].label_prov;
															});														
														});
														

														var kode_go_hal_rinci = {
															go_rinci: false,
															// kode: lru1
															kode: idsubbl
														};
														if(opsi && opsi.action){
															var aksi = opsi.action.split("main?");
															//if(aksi.length > 2){
															if(idsubbl > 2){																
																kode_go_hal_rinci.go_rinci = true;
																// kode_go_hal_rinci.kode = 'main?'+aksi[1].split("'")[0];
																kode_go_hal_rinci.kode = idsubbl;
															}else{
																var data = {
																	message:{
																		type: "get-url",
																		content: {
																			url: config.url_server_lokal,
																			type: 'post',
																			data: data_rka,
																			return: false
																		}
																	}
																};
																if(!opsi || !opsi.no_return){
																	data.message.content.return = true;
																}
																chrome.runtime.sendMessage(data, function(response) {
																	// console.log('responeMessage', response);
																	// return resolve_reduce(nextData);
																});
																if(callback){
																	callback();
																}
																console.log('Send RENJA tanpa rincian!');
																return true;
															}
														}

														// cek jika rincian 0 maka langsung return.
														// dimatikan karena rincian yang dinollkan pada apbd-p tidak ikut ketarik
														/*
														if(
															subkeg.dataBl[0].pagu == 0
															|| subkeg.dataBl[0].pagu == ''
															|| !subkeg.dataBl[0].pagu
														){
															data_rka.no_page = 1;
															data_rka.rka = 0;
															var data = {
																message:{
																	type: "get-url",
																	content: {
																		url: config.url_server_lokal,
																		type: 'post',
																		data: data_rka,
																		return: false
																	}
																}
															};
															if(!opsi || !opsi.no_return){
																data.message.content.return = true;
															}
															chrome.runtime.sendMessage(data, function(response) {
																// console.log('responeMessage', response);
															});
															if(callback){
																callback();
															}
															console.log('Rincian kosong di SIPD!');
															return true;
														}
														*/

														go_halaman_detail_rincian(kode_go_hal_rinci).then(function(kode_get_rinci_all){
															// subkeg = JSON.parse(subkeg);
															// get rincian belanja
															// var kode_get_rinci = kode_get_rinci_all.kode_get_rinci;
															// var kode_get_rinci_subtitle = kode_get_rinci_all.kode_get_rinci_subtitle;
															// var kode_get_rinci_realisasi = kode_get_rinci_all.kode_get_rinci_realisasi;
															relayAjax({
																// url: kode_get_rinci,
																url: config.sipd_url+'api/renja/rinci_sub_bl/list_by_id_skpd',						
																type: 'POST',	      				
																data: {            
																		tahun: _token.tahun,
																		id_daerah: _token.daerah_id,												
																		// id_program: opsi.id_program,
																		// id_giat: opsi.id_giat,
																		// id_unit: opsi.id_unit,
																		id_skpd: opsi.id_skpd,
																		id_sub_skpd: opsi.id_sub_skpd,
																	},
																beforeSend: function (xhr) {			    
																	xhr.setRequestHeader("X-API-KEY", x_api_key());
																	xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
																},
																success: function(data){
																	console.log('go_halaman_detail_rincian', data);
																	var _leng = config.jml_rincian;
																			var _data_all = [];
																			var _data = [];
																			data.data.map(function(rka, i){
																				var _rka = {};
																				_rka.action = rka.action;
																				_rka.created_user = rka.created_user;
																				_rka.createddate = rka.createddate;
																				_rka.createdtime = rka.createdtime;
																				_rka.harga_satuan = rka.harga_satuan;
																				_rka.harga_satuan_murni = rka.harga_satuan_murni;
																				_rka.id_daerah = rka.id_daerah;
																				_rka.id_rinci_sub_bl = rka.id_rinci_sub_bl;
																				_rka.id_subs_sub_bl = rka.id_subs_sub_bl; //baru
																				_rka.id_ket_sub_bl = rka.id_ket_sub_bl; //baru
																				_rka.id_standar_nfs = rka.id_standar_nfs;
																				_rka.id_standar_harga = rka.id_standar_harga; //baru
																				_rka.id_dana = rka.id_dana; //baru
																				_rka.id_blt = rka.id_blt; //baru
																				_rka.id_usulan = rka.id_usulan; //baru
																				_rka.id_jenis_usul = rka.id_dana; //baru
																				_rka.is_locked = rka.is_locked;
																				_rka.jenis_bl = rka.jenis_bl;
																				_rka.ket_bl_teks = rka.ket_bl_teks;
																				_rka.id_akun = rka.id_akun;
																				_rka.kode_akun = rka.kode_akun;
																				_rka.koefisien = rka.koefisien;
																				_rka.koefisien_murni = rka.koefisien_murni;
																				_rka.lokus_akun_teks = rka.lokus_akun_teks;
																				_rka.nama_akun = rka.nama_akun;
																				if(rka.nama_standar_harga && rka.nama_standar_harga.nama_komponen){
																					_rka.nama_komponen = rka.nama_standar_harga;
																					_rka.spek_komponen = rka.nama_standar_harga;
																					// _rka.nama_komponen = rka.nama_standar_harga.nama_komponen;
																					// _rka.spek_komponen = rka.nama_standar_harga.spek_komponen;
																				}else{
																					_rka.nama_komponen = '';
																					_rka.spek_komponen = '';
																				}
																				if(rka.satuan){
																					_rka.satuan = rka.satuan;
																				}else{
																					if(_rka.koefisien){
																						_rka.satuan = rka.koefisien.split(' ');
																						_rka.satuan.shift();
																						_rka.satuan = _rka.satuan.join(' ');
																					}
																				}
																				_rka.sat1 = rka.sat_1;
																				_rka.sat2 = rka.sat_2;
																				_rka.sat3 = rka.sat_3;
																				_rka.sat4 = rka.sat_4;
																				_rka.spek = rka.spek;
																				_rka.volum1 = rka.vol_1;
																				_rka.volum2 = rka.vol_2;
																				_rka.volum3 = rka.vol_3;
																				_rka.volum4 = rka.vol_4;
																				_rka.volume = rka.volume;
																				_rka.volume_murni = rka.volume_murni;
																				// _rka.subs_bl_teks = substeks_all[rka.subs_bl_teks.substeks];
																				// _rka.total_harga = rka.rincian;
																				_rka.total_harga = rka.total_harga;
																				_rka.rincian = rka.total_harga;
																				// _rka.rincian = rka.rincian;
																				// _rka.rincian_murni = rka.rincian_murni;
																				_rka.rincian_murni = rka.rkpd_murni; //baru
																				_rka.pajak = rka.pajak;
																				_rka.pajak_murni = rka.pajak_murni;
																				_rka.totalpajak = rka.totalpajak;
																				_rka.updated_user = rka.updated_user;
																				_rka.updateddate = rka.updateddate;
																				_rka.updatedtime = rka.updatedtime;
																				_rka.user1 = rka.user1;
																				_rka.user2 = rka.user2;
																				_rka.id_prop_penerima = 0;
																				_rka.id_camat_penerima = 0;
																				_rka.id_kokab_penerima = 0;
																				_rka.id_lurah_penerima = 0;
																				_rka.id_penerima = 0;
																				_rka.idkomponen = 0;
																				_rka.idketerangan = rka.id_ket_sub_bl;
																				_rka.idsubtitle = rka.id_subs_sub_bl;
																				_rka.set_sisa_kontrak = rka.set_sisa_kontrak; //baru																				
																				// _rka.idketerangan = 0;
																				// _rka.idsubtitle = 0;																				
																				_data.push(_rka);
																				if((i+1)%_leng == 0){
																					_data_all.push(_data);
																					_data = [];
																				}
																			});
																			if(_data.length > 0){
																				_data_all.push(_data);
																			}
																			console.log('_data_all', _data_all);

																			var no_excel = 0;
																			var no_page = 0;
																			var total_page = _data_all.length;
																			var last = _data_all.length-1;

																			_data_all.reduce(function(sequence, nextData){
																				return sequence.then(function(current_data){
																					return new Promise(function(resolve_reduce, reject_reduce){
																						console.log('current_data', current_data);
																						var sendData = current_data.map(function(rka, i){
																							data_rka.rka[i] = rka;
																							if(
																								(
																									rka.id_rinci_sub_bl == null 
																									|| rka.id_rinci_sub_bl == '' 
																								) || (
																									rka.action == '' && !config.sipd_private
																								)
																							){
																								return Promise.resolve();
																							// }
																							}else{
																								try{
																									var kode_get_rka = rka.action.split("ubahKomponen('")[1].split("'")[0];
																								}catch(e){
																									var kode_get_rka = false;
																								}
																								return getDetailRin(id_unit, kode_sbl, rka.id_rinci_sub_bl, 0, kode_get_rka).then(function(detail_rin){
																									if(detail_rin){
																										data_rka.rka[i].id_prop_penerima = detail_rin.id_prop_penerima;
																										data_rka.rka[i].id_camat_penerima = detail_rin.id_camat_penerima;
																										data_rka.rka[i].id_kokab_penerima = detail_rin.id_kokab_penerima;
																										data_rka.rka[i].id_lurah_penerima = detail_rin.id_lurah_penerima;
																										data_rka.rka[i].id_penerima = detail_rin.id_penerima;
																										data_rka.rka[i].idkomponen = detail_rin.idkomponen;
																										data_rka.rka[i].idketerangan = detail_rin.idketerangan;
																										data_rka.rka[i].idsubtitle = detail_rin.idsubtitle;
																									}
																									if(!opsi){
																										no_excel++;
																										var tbody_excel = ''
																											+'<tr>'
																												+'<td style="mso-number-format:\@;">'+no_excel+'</td>'
																												+'<td style="mso-number-format:\@;">'+kode_sbl+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].jenis_bl+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idsubtitle+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].subs_bl_teks+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idketerangan+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].ket_bl_teks+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].kode_akun+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].nama_akun+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].nama_komponen+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].spek_komponen+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].koefisien+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].satuan+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].harga_satuan+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].totalpajak+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].rincian+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_rinci_sub_bl+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_penerima+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].lokus_akun_teks+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_prop_penerima+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_camat_penerima+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_kokab_penerima+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_lurah_penerima+'</td>'
																												+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idkomponen+'</td>'
																											+'</tr>';
																										jQuery('#data_rin_excel').append(tbody_excel);
																										console.log('data_rka.rka[i]', data_rka.rka[i]);
																									}
																								});
																							}
																						});
																						Promise.all(sendData)
																						.then(function(val_all){
																							// console.log('sendMessage tes');
																							no_page++;
																							data_rka.no_page = no_page;
																							data_rka.total_page = total_page;
																							var data = {
																								message:{
																									type: "get-url",
																									content: {
																										url: config.url_server_lokal,
																										type: 'post',
																										data: data_rka,
																										return: true
																									}
																								}
																							};
																							if(typeof continue_singkron_rka == 'undefined'){
																								window.continue_singkron_rka = {};
																							}
																							continue_singkron_rka[kode_sbl] = {
																								no_resolve: false,
																								resolve: resolve_reduce,
																								next: nextData,
																								alert: false
																							};
																							if(!opsi || !opsi.no_return){
																								continue_singkron_rka[kode_sbl].alert = true;
																							}
																							if(
																								total_page == 1
																								|| total_page == no_page
																							){
																								continue_singkron_rka[kode_sbl].no_resolve = true;
																								resolve_reduce(nextData);
																							}
																							chrome.runtime.sendMessage(data, function(response) {});
																						})
																						.catch(function(err){
																							console.log('err', err);
																							return resolve_reduce(nextData);
																						});
																					})
																					.catch(function(e){
																						console.log(e);
																						return Promise.resolve(nextData);
																					});
																				})
																				.catch(function(e){
																					console.log(e);
																					return Promise.resolve(nextData);
																				});
																			}, Promise.resolve(_data_all[last]))
																			.then(function(data_last){
																				// jika sub kegiatan aktif tapi nilai rincian dikosongkan, maka tetap perlu disingkronkan ke lokal
																				if(_data_all.length == 0){
																					data_rka.no_page = no_page;
																					data_rka.total_page = total_page;
																					var data = {
																						message:{
																							type: "get-url",
																							content: {
																								url: config.url_server_lokal,
																								type: 'post',
																								data: data_rka,
																								return: true
																							}
																						}
																					};
																					if(typeof continue_singkron_rka == 'undefined'){
																						window.continue_singkron_rka = {};
																					}
																					continue_singkron_rka[kode_sbl] = {
																						no_resolve: true,
																						alert: false
																					};
																					if(!opsi || !opsi.no_return){
																						continue_singkron_rka[kode_sbl].alert = true;
																					}
																					chrome.runtime.sendMessage(data, function(response) {});
																				}
																				console.log('selesai kirim data ke lokal!', opsi);
																			});

																			// langsung jalankan callback untuk proses ke sub keg selanjutnya
																			if(callback){
																				callback();
																			}
																	// var substeks_all = {};
																	// data.data.map(function(rka, i){
																	// 	var substeks = jQuery('<textarea>'+rka.subs_bl_teks.substeks+'</textarea>').val();
																	// 	if(!substeks_all[substeks]){
																	// 		substeks_all[substeks] = rka.subs_bl_teks;
																	// 	}
																	// });

																	// getRealisasiBelanja(kode_get_rinci_realisasi).then(function(realisasi){
																	// 	data_rka.realisasi = realisasi;
																	// 	getSumberDanaBelanja(substeks_all, kode_get_rinci_subtitle).then(function(substeks_all){
																			

																			
																			
																	// 	});
																	// });
																}
															});
														});

													}
												});
											// });
										});
									});
								});
							});
						});
					});
				});
			});
		}else{
			alert('ID Belanja tidak ditemukan!');
			jQuery('#wrap-loading').hide();
		}
	}
}

function getJadwalAktifRenja(){
	return new Promise(function(resolve, reduce){
		relayAjax({
			url: config.sipd_url+'api/jadwal/renja_jadwal/cek_aktif',
			cache: true,
			type: 'post',
			data: {
				id_daerah: _token.daerah_id,
				tahun: _token.tahun,
			},
			beforeSend: function (xhr) {
			    xhr.setRequestHeader("x-api-key", x_api_key());
				xhr.setRequestHeader("x-access-token", _token.token);
			},
			success: function(ret){
				relayAjax({
					url: config.sipd_url+'api/master/tahapan/view/'+ret.data[0].id_tahap,
					cache: true,
					beforeSend: function (xhr) {
					    xhr.setRequestHeader("x-api-key", x_api_key());
						xhr.setRequestHeader("x-access-token", _token.token);
					},
					success: function(ret2){
						ret.data[0].detail_tahap = ret2.data[0];
						resolve(ret.data[0]);
					}
				});
			}
		});
	});
}

function get_skpd(tahun, iddaerah, idskpd){
    return new Promise(function(resolve, reject){
		relayAjax({	      	
			url: config.sipd_url+'api/master/skpd/view/'+idskpd+'/'+tahun+'/'+iddaerah,			
			type: 'GET',	      				
			processData: false,
			contentType : 'application/json',
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},	
	      	success: function(skpd){
	      		return resolve(skpd);
	      	}
	    });
    });
}

function list_belanja_by_tahun_daerah_unit(idskpd){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/sub_bl/list_belanja_by_tahun_daerah_unit',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_unit: idskpd
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(subkeg){
	      		return resolve(subkeg);
	      	}
	    });
    });
}

function setup_unit(idunit){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/setup_unit/find_by_id_unit',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_unit: idunit
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(opd){
	      		return resolve(opd);
	      	}
	    });
    });
}

function get_pagu_validasi(tahun, iddaerah, idskpd){
    return new Promise(function(resolve, reject){
		relayAjax({	      	
			url: config.sipd_url+'api/renja/setup_unit/pagu_validasi?tahun='+tahun+'&id_daerah='+iddaerah+'&id_unit='+idskpd,			
			type: 'GET',	      							
			contentType : 'application/json',
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},	
	      	success: function(data){
	      		return resolve(data);
	      	}
	    });
    });
}

function total_usul_bantuan(idskpd){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/usulan/usul_bantuan/total_approve',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_skpd: idskpd
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(asmas){
	      		return resolve(asmas);
	      	}
	    });
    });
}

function total_usul_pokir(idskpd){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/usulan/usul_pokir/total_approve',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_skpd: idskpd
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(pokir){
	      		return resolve(pokir);
	      	}
	    });
    });
}

function sub_bl_view(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/sub_bl/view/'+id_sub_bl,                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(sub_bl_view){
	      		return resolve(sub_bl_view);
	      	}
	    });
    });
}

function master_label_giat(){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/master/label_giat/list',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(master_label_giat){
	      		return resolve(master_label_giat);
	      	}
	    });
    });
}

function master_lokasi(){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/master/daerah/lokasi',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(master_lokasi){
	      		return resolve(master_lokasi);
	      	}
	    });
    });
}

function master_sumberdana(){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/master/sumber_dana/list',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					length: 1000,
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(master_sumberdana){
	      		return resolve(master_sumberdana);
	      	}
	    });
    });
}

function rinci_sub_bl(idskpd){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/rinci_sub_bl/list_by_id_skpd',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_skpd: idskpd
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(rinci_sub_bl){
	      		return resolve(rinci_sub_bl);
	      	}
	    });
    });
}

function tag_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/tag_bl/get_by_id_sub_bl',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(tag_bl){
	      		return resolve(tag_bl);
	      	}
	    });
    });
}

function label_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/label_bl/get_by_id_sub_bl',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					// id_unit: id_unit,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(labelbl){
	      		return resolve(labelbl);
	      	}
	    });
    });
}

function subs_sub_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/subs_sub_bl/list',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(subs_sub_bl){
	      		return resolve(subs_sub_bl);
	      	}
	    });
    });
}

function ket_sub_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/ket_sub_bl/list',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(ket_sub_bl){
	      		return resolve(ket_sub_bl);
	      	}
	    });
    });
}

function dana_sub_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/dana_sub_bl/get_by_id_sub_bl',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(dana_sub_bl){
	      		return resolve(dana_sub_bl);
	      	}
	    });
    });
}

function detil_lokasi_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/detil_lokasi_bl/get_by_id_sub_bl',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(detil_lokasi_bl){
	      		return resolve(detil_lokasi_bl);
	      	}
	    });
    });
}

function capaian_bl(id_unit, id_skpd, id_sub_skpd, id_program, id_giat){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/capaian_bl/load_data',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_program: id_program,
					id_giat: id_giat,
					id_unit: id_unit,
					id_skpd: id_skpd,
					id_sub_skpd: id_sub_skpd,
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(capaian_bl){
	      		return resolve(capaian_bl);
	      	}
	    });
    });
}

//output sub giat
function output_bl(id_sub_bl){    
    return new Promise(function(resolve, reject){    	
		relayAjax({
			url: config.sipd_url+'api/renja/output_bl/get_by_id_sub_bl',                                    
			type: 'POST',	      				
			data: {            
					id_daerah: _token.daerah_id,				
					tahun: _token.tahun,
					id_sub_bl: id_sub_bl
				},
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},
	      	success: function(output_bl){
	      		return resolve(output_bl);
	      	}
	    });
    });
}

function get_master_label_kokab(tahun, iddaerah, id_label_kokab){
    return new Promise(function(resolve, reject){
		relayAjax({	      	
			url: config.sipd_url+'api/master/label_kokab/view/'+id_label_kokab+'/'+tahun+'/'+iddaerah,			
			type: 'GET',	      							
			contentType : 'application/json',
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},	
	      	success: function(data){
	      		return resolve(data);
	      	}
	    });
    });
}

function get_sumber_dana(tahun, id_dana){
    return new Promise(function(resolve, reject){
		relayAjax({	      	
			url: config.sipd_url+'api/master/sumber_dana/view/'+id_dana+'/'+tahun,			
			type: 'GET',	      							
			contentType : 'application/json',
			beforeSend: function (xhr) {			    
				xhr.setRequestHeader("X-API-KEY", x_api_key());
				xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
			},	
	      	success: function(data){
	      		return resolve(data);
	      	}
	    });
    });
}

function get_kode_from_rincian_page(opsi, kode_sbl){
	return new Promise(function(resolve, reject){
		if(!opsi || !opsi.kode_bl){
			// var url_sub_keg = jQuery('.white-box .p-b-20 a.btn-circle').attr('href');
			relayAjax({
				url: config.sipd_url+'api/renja/rinci_sub_bl/list_by_id_skpd',                                    
				type: 'POST',	      				
				data: {            
						id_daerah: _token.daerah_id,				
						tahun: _token.tahun,
						id_skpd: opsi.id_unit,
					},
				beforeSend: function (xhr) {			    
					xhr.setRequestHeader("X-API-KEY", x_api_key());
					xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
				},
				success: function(html){
					// var url_list_sub = html.split('lru8="')[1].split('"')[0];
					relayAjax({
						// url: url_list_sub,
						url: config.sipd_url+'api/renja/sub_bl/list_belanja_by_tahun_daerah_unit',                                    
						type: 'POST',	      				
						data: {            
								id_daerah: _token.daerah_id,				
								tahun: _token.tahun,
								id_unit: opsi.id_unit,
							},
						beforeSend: function (xhr) {			    
							xhr.setRequestHeader("X-API-KEY", x_api_key());
							xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
						},
						success: function(subkeg){
							var cek = false;
							// ganti menjadi true jika ingin mengsingkronkan sub keg yang tergembok / nomenklatur lama
							var allow_lock_subkeg = false;
							subkeg.data.map(function(b, i){
								if(
									(
										allow_lock_subkeg 
										|| b.sub_giat_locked == 0
									)
									&& b.kode_sub_skpd
									&& b.kode_sbl == kode_sbl
								){
									cek = true;
									// return resolve({ url: b.action.split("detilGiat('")[1].split("'")[0], data: b });
									return resolve({ data: b });
								}
							});
							if(!cek){
								alert('Sub kegiatan ini tidak ditemukan di SIPD. (Sub kegiatan tergembok / sudah dihapus)');
							}
						}
					});
				}
			});
		}else{
			return resolve(false);
		}
	});
}

function go_halaman_detail_rincian(options){
	return new Promise(function(resolve, reject){
		if(!options.go_rinci){
			return resolve({
				kode_get_rinci: options.kode,
				// kode_get_rinci_subtitle: lru19,
				// kode_get_rinci_realisasi: lru18
			});
		}else{
			relayAjax({
				// url: options.kode,
				url: config.sipd_url+'api/renja/sub_bl/view/'+options.kode,                                    
				type: 'POST',	      				
				data: {            
						id_daerah: _token.daerah_id,				
						tahun: _token.tahun
					},
				beforeSend: function (xhr) {			    
					xhr.setRequestHeader("X-API-KEY", x_api_key());
					xhr.setRequestHeader("X-ACCESS-TOKEN", _token.token);  
				},
				success: function(html){
					console.log('go_halaman_detail_rincian', html);
					var kode_get_rinci = html.data.id_sub_bl;
					// var kode_get_rinci = html.split('lru1="')[1].split('"')[0];
					// var kode_get_rinci_realisasi = html.split('lru18="')[1].split('"')[0];
					// var kode_get_rinci_subtitle = html.split('lru19="')[1].split('"')[0];
					return resolve({
						kode_get_rinci: kode_get_rinci,
						// kode_get_rinci: kode_get_rinci,
						// kode_get_rinci_subtitle: kode_get_rinci_subtitle,
						// kode_get_rinci_realisasi: kode_get_rinci_realisasi
					});
				}
			});
		}
	})
	.catch(function(e){
        console.log(e);
        return Promise.resolve();
    });
}


function getRealisasiBelanja(kode_get_rinci_realisasi){
	return new Promise(function(resolve, reject){
		if(config.realisasi){
			jQuery.ajax({
				url: kode_get_rinci_realisasi,
				type: 'post',
				data: "_token="+tokek+'&v1bnA1m='+v1bnA1m,
				success: function(ret){
					return resolve(ret.data);
				},
				error: function(ret){
					return resolve(false);
				}
			});
		}else{
			return resolve(false);
		}
	})
}

function getSumberDanaBelanja(substeks_all, kode_get_rinci_subtitle){
	return new Promise(function(resolve, reject){
		var data_array = [];
		for(var i in substeks_all){
			data_array.push({
				kelompok: i,
				data: substeks_all[i]
			});
		}
		var last = data_array.length-1;
		data_array.reduce(function(sequence, nextData){
            return sequence.then(function(current_data){
        		return new Promise(function(resolve_reduce, reject_reduce){
        			if(
						current_data.kelompok == ''
						|| current_data.kelompok == '_'
						|| current_data.kelompok == null
						|| !current_data.kelompok
					){
						substeks_all[current_data.kelompok].sumber_dana = {
							"id_subtitle":null,
							"subtitle_teks":"",
							"is_paket":1,
							"id_dana":null,
							"kode_dana":null,
							"nama_dana":null
						};
						resolve_reduce(nextData);
					}else{
						var formDataCustom = new FormData();
						formDataCustom.append('_token', tokek);
						formDataCustom.append('v1bnA1m', v1bnA1m);
						formDataCustom.append('DsK121m', Curut("id_subtitle=0&subs_teks="+encodeURIComponent(current_data.kelompok)));
						relayAjax({
							url: kode_get_rinci_subtitle+'&subs_teks='+current_data.kelompok,
							type: 'post',
					        data: formDataCustom,
					        processData: false,
					        contentType: false,
							success: function(data){
								var subs_teks = this.url.split('&subs_teks=')[1];
								substeks_all[current_data.kelompok].sumber_dana = data;
								resolve_reduce(nextData);
							}
						});
					}
        		})
                .catch(function(e){
                    console.log(e);
                    return Promise.resolve(nextData);
                });
            })
            .catch(function(e){
                console.log(e);
                return Promise.resolve(nextData);
            });
        }, Promise.resolve(data_array[last]))
        .then(function(data_last){
        	resolve(substeks_all);
        });
	});
}

function getDetailRin(id_unit, kode_sbl, idbelanjarinci, nomor_lampiran, kode_get_rka){
	return new Promise(function(resolve, reject){
		if(!kode_get_rka && !config.sipd_private){
			if(typeof resolve_get_url == 'undefined'){
				window.resolve_get_url = {};
			}
			resolve_get_url[idbelanjarinci] = resolve;
			var data_send = { 
				action: 'get_data_rka',
				api_key: config.api_key,
				tahun_anggaran: config.tahun_anggaran,
				kode_sbl: kode_sbl,
				idbelanjarinci: idbelanjarinci
			};
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_send,
		    			return: true
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
		}else{
			getKeyCariRinc(kode_get_rka, id_unit, kode_sbl, idbelanjarinci).then(function(kode_get_rka){
				getToken().then(function(_token){
					relayAjax({
						// url: config.sipd_url+'daerah/main/'+get_type_jadwal()+'/belanja/'+config.tahun_anggaran+'/rinci/cari-rincian/'+config.id_daerah+'/'+id_unit,
						url: config.sipd_url+'daerah/main?'+kode_get_rka,
						type: 'POST',
						data: formData,
						processData: false,
						contentType: false,
						success: function(rinci){
							if(nomor_lampiran == 5){
								getProv(id_unit, rincsub[kode_sbl].lru4).then(function(prov){
									if(prov[rinci.id_prop_penerima]){
										rinci.nama_prop = prov[rinci.id_prop_penerima].nama;
										getKab(id_unit, rinci.id_prop_penerima, rincsub[kode_sbl].lru5).then(function(kab){
											if(kab[rinci.id_kokab_penerima]){
												rinci.nama_kab = kab[rinci.id_kokab_penerima].nama;
												getKec(id_unit, rinci.id_prop_penerima, rinci.id_kokab_penerima, rincsub[kode_sbl].lru6).then(function(kec){
													if(kec[rinci.id_camat_penerima]){
														rinci.nama_kec = kec[rinci.id_camat_penerima].nama;
														getKel(id_unit, rinci.id_prop_penerima, rinci.id_kokab_penerima, rinci.id_camat_penerima, rincsub[kode_sbl].lru7).then(function(kel){
															if(kel[rinci.id_lurah_penerima]){
																rinci.nama_kel = kel[rinci.id_lurah_penerima].nama;
																return resolve(rinci);
															}else{
																return resolve(rinci);
															}
														});
													}else{
														return resolve(rinci);
													}
												});
											}else{
												return resolve(rinci);
											}
										});
									}else{
										return resolve(rinci);
									}
								});
							}else{
								return resolve(rinci);
							}
						},
						error: function(e){
							return resolve(false)
						}
					});
				});
			});
		}
	});
}