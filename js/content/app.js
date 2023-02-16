_interval = false;

let previousUrl = "";
const observer = new MutationObserver(() => {
  	if (window.location.href !== previousUrl) {
	    console.log(`URL changed from ${previousUrl} to ${window.location.href}`);
	    previousUrl = window.location.href;
	    cekUrl(previousUrl);
  	}
});

observer.observe(document, { subtree: true, childList: true });

function cekUrl(current_url){
	getToken();
	
	// untuk menjaga session
	clearInterval(_interval);
	intervalSession();

	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	    +'</div>';
	if(jQuery('#wrap-loading').length == 0){
		jQuery('body').prepend(loading);
	}

	jQuery('.aksi-extension').remove();
	jQuery('#modal-extension').remove();

	setTimeout(function(){
		var title_admin = jQuery('#kt_header .menu-title.text-white');
		if(title_admin.length >= 1){
			var aksi_admin = ''
				+'<div id="aksi-admin" class="menu-item me-lg-1">'
					+'<a class="btn btn-success btn-sm" onclick="ganti_tahun();" style="margin-left: 2px;">Ganti Tahun Anggaran</a>'
					+'<a class="btn btn-danger btn-sm" onclick="logout();" style="margin-left: 5px;">Keluar</a>'
				+'</div>'
			if(jQuery('#aksi-admin').length == 0){
				title_admin.closest('.menu-item').after(aksi_admin);
			}
		}
	}, 1000);

	if(current_url.indexOf('/auth/login') != -1){
		var lihat_pass = ''
			+'<label style="margin-top: 15px; margin-bottom: 15px;"><input type="checkbox" onclick="lihat_password(this)"> Lihat Password</label>'
			+'<a class="btn btn-lg btn-warning w-100" onclick="login_sipd()">Login Chrome Extension</a>';
		setTimeout(function(){
			jQuery('input[name="password"]').after(lihat_pass);
		}, 1000);
	}else if(current_url.indexOf('/perencanaan/rpjpd/cascading/') != -1){
		var modal = ''
			+'<div class="modal fade modal-extension" id="modal-extension" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true" style="z-index: 99999; background: #0000003d;">'
		        +'<div class="modal-dialog" style="max-width: 1500px;" role="document">'
		            +'<div class="modal-content">'
		                +'<div class="modal-header bgpanel-theme">'
		                    +'<h3 class="fw-bolder m-0">Data RPJPD WP-SIPD</h4>'
		                    +'<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>'
		                +'</div>'
		                +'<div class="modal-body">'
		                  	+'<table class="table table-bordered table-hover table-striped" id="table-extension">'
		                      	+'<thead>'
		                        	+'<tr>'
		                          		+'<th class="text-center" style="font-weight: bold;"><input type="checkbox" id="modal_cek_all"></th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Visi</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Misi</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Sasaran</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Kebijakan</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Strategi</th>'
		                        	+'</tr>'
		                      	+'</thead>'
		                      	+'<tbody></tbody>'
		                  	+'</table>'
		                +'</div>'
		                +'<div class="modal-footer">'
		                    +'<button type="button" class="btn btn-primary" id="proses-extension">Singkronisasi</button>'
		                    +'<button type="button" class="btn btn-default" data-dismiss="modal">Tutup</button>'
		                +'</div>'
		            +'</div>'
		        +'</div>'
		    +'</div>';
		jQuery('body').append(modal);
		jQuery('#proses-extension').on('click', function(){
			singkronisasi_rpjpd_dari_lokal();
		});
	    jQuery('#modal_cek_all').on('click', function(){
			var cek = jQuery(this).is(':checked');
			jQuery('#table-extension tbody tr input[type="checkbox"]').prop('checked', cek);
		});
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'
					+'<button style="margin-left: 20px;" class="btn btn-md btn-warning" id="get_rpjpd_lokal">Singkronisasi Data RPJPD dari WP-SIPD</button>'
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#get_rpjpd_lokal').on('click', function(){
				get_rpjpd_lokal();
			});
		}, 1000);
	}else if(current_url.indexOf('/perencanaan/rpd/cascading/') != -1){
		window.type_data_rpd = 'tujuan';
		var header_isu = 'Isu Strategi RPJPD';
		var header_tujuan = 'Tujuan Teks';
		if(current_url.indexOf('/perencanaan/rpd/cascading/tujuan') != -1){
			type_data_rpd = 'tujuan';
		}else if(current_url.indexOf('/perencanaan/rpd/cascading/sasaran') != -1){
			header_isu = 'Tujuan Teks';
			header_tujuan = 'Sasaran Teks';
			type_data_rpd = 'sasaran';
		}else if(current_url.indexOf('/perencanaan/rpd/cascading/program') != -1){
			header_isu = 'Sasaran Teks';
			header_tujuan = 'Program Teks';
			type_data_rpd = 'program';
		}
		var modal = ''
			+'<div class="modal fade modal-extension" id="modal-extension" tabindex="-1" role="dialog" data-backdrop="static" aria-hidden="true" style="z-index: 99999; background: #0000003d;">'
		        +'<div class="modal-dialog" style="max-width: 1500px;" role="document">'
		            +'<div class="modal-content">'
		                +'<div class="modal-header bgpanel-theme">'
		                    +'<h3 class="fw-bolder m-0">Data RPD WP-SIPD</h4>'
		                    +'<button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>'
		                +'</div>'
		                +'<div class="modal-body">'
		                  	+'<table class="table table-bordered table-hover" id="table-extension">'
		                      	+'<thead>'
		                        	+'<tr>'
		                          		+'<th class="text-center" style="font-weight: bold;"><input type="checkbox" id="modal_cek_all"></th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Status</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">'+header_isu+'</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">'+header_tujuan+'</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Indikator Teks</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target Awal</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target 1</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target 2</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target 3</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target 4</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target 5</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Target Akhir</th>'
		                          		+'<th class="text-center" style="font-weight: bold;">Keterangan</th>'
		                        	+'</tr>'
		                      	+'</thead>'
		                      	+'<tbody></tbody>'
		                  	+'</table>'
		                +'</div>'
		                +'<div class="modal-footer">'
		                    +'<button type="button" class="btn btn-primary" id="proses-extension">Singkronisasi</button>'
		                    +'<button type="button" class="btn btn-default" data-dismiss="modal">Tutup</button>'
		                +'</div>'
		            +'</div>'
		        +'</div>'
		    +'</div>';
		jQuery('body').append(modal);
		jQuery('#proses-extension').on('click', function(){
			singkronisasi_rpd_dari_lokal();
		});
	    jQuery('#modal_cek_all').on('click', function(){
			var cek = jQuery(this).is(':checked');
			jQuery('#table-extension tbody tr input[type="checkbox"]').prop('checked', cek);
		});
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'
					+'<button style="margin-left: 20px;" class="btn btn-sm btn-warning" id="get_rpd_lokal">Singkronisasi Data RPD dari WP-SIPD</button>'
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#get_rpd_lokal').on('click', function(){
				get_rpd_lokal();
			});
		}, 1000);
	}
	// Data pengaturan SIPD
	else if(current_url.indexOf('/pengaturan/sipd') != -1)
	{
		console.log('halaman Pengaturan SIPD');		
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_pengaturan_sipd_lokal">Singkron ke DB Lokal</button>'					
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_pengaturan_sipd_lokal').on('click', function(){
				singkron_pengaturan_sipd_lokal();
			});
		}, 1000);
	}
	// Data Master User
	else if(current_url.indexOf('/user') != -1)
	{
		if(current_url.indexOf('/user/admin_bappeda_keuangan') != -1)
		{
			console.log('halaman User admin_bappeda_keuangan');		
			level = "3,4";
			levelmitra = "7,11";			
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/ppkd') != -1)
		{
			console.log('halaman User ppkd');	
			level = "8";
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/anggota_dewan') != -1)
		{
			console.log('halaman User anggota_dewan');		
			level = "16";
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/penyelia_inspektorat') != -1)
		{
			console.log('halaman User penyelia_inspektorat');		
			level = "26";
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/penyelia_barang_jasa') != -1)
		{
			console.log('halaman User penyelia_barang_jasa');
			level = "30";		
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/kelurahan_desa') != -1)
		{
			console.log('halaman User kelurahan_desa');	
			level = "20";	
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/admin_standar_harga') != -1)
		{
			console.log('halaman User admin_standar_harga');
			level = "6";
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/masyarakat') != -1)
		{
			console.log('halaman User masyarakat');	
			level = "21";		
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_masyarakat_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_masyarakat_lokal').on('click', function(){
					singkron_user_masyarakat_lokal(level);
				});
			}, 1000);
		}
		else if(current_url.indexOf('/user/penyelia_standar_harga') != -1)
		{
			console.log('halaman User Penyelia Standar Harga');	
			level = "10,14";	
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_user_dewan_lokal">Singkron User ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_user_dewan_lokal').on('click', function(){
					singkron_user_dewan_lokal(level);
				});
			}, 1000);
		}
	}	
	// Data Master SKPD
	else if(current_url.indexOf('/master/skpd') != -1)
	{
		console.log('halaman Master SKPD');		
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_skpd_ke_lokal">Singkron ke DB Lokal</button>'
					+'<button class="btn btn-md btn-success btn-outline" id="tampil_laporan_renja" style="margin-left: 3px;">'
						+'Tampilkan Link Print RENJA'
					+'</button>';
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_skpd_ke_lokal').on('click', function(){
				singkron_skpd_ke_lokal();
			});
			jQuery('#tampil_laporan_renja').on('click', function(){
				singkron_skpd_ke_lokal(1);
			});
		}, 1000);
	}
	// Data Master Urusan, Bidang, Program, Kegiatan, Sub Kegiatan
	else if(current_url.indexOf('/master/sub_giat') != -1)
	{
		console.log('halaman Master Program Kegiatan Sub Kegiatan');		
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_data_giat_lokal">Singkron ke DB Lokal</button>'					
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_data_giat_lokal').on('click', function(){
				singkron_data_giat_lokal();
			});
		}, 1000);
	}
	// Data Master Akun
	else if(current_url.indexOf('/master/akun') != -1)
	{
		console.log('halaman Master Akun Belanja');		
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_akun_ke_lokal">Singkron ke DB Lokal</button>'					
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_akun_ke_lokal').on('click', function(){
				singkron_akun_ke_lokal();
			});
		}, 1000);
	}
	// Data Master Akun
	else if(current_url.indexOf('/master/sumber_dana') != -1)
	{
		console.log('halaman Master Sumber Dana');		
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_sumber_dana_lokal">Singkron ke DB Lokal</button>'					
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_sumber_dana_lokal').on('click', function(){
				singkron_sumber_dana_lokal();
			});
		}, 1000);
	}
	// kamus usulan
	else if(current_url.indexOf('/settings/kamus_usulan/asmas') != -1){
		console.log('halaman Kamus Usulan Aspirasi Masyarakat');
		tipe = 'asmas';
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_kamus_usulan_pokir">Singkron Kamus '+tipe+' ke DB Lokal</button>'
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_kamus_usulan_pokir').on('click', function(){
				singkron_kamus_usulan_pokir(tipe);
			});
		}, 1000);
	}
	else if(current_url.indexOf('/settings/kamus_usulan/reses') != -1)
	{
		console.log('halaman Kamus Usulan Aspirasi Anggota Dewan (Pokir / Reses)');
		tipe = 'reses';
		setTimeout(function(){
			jQuery('.aksi-extension').remove();
			var btn = ''
				+'<div class="aksi-extension">'						
					+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_kamus_usulan_pokir">Singkron Kamus '+tipe+' ke DB Lokal</button>'
				+'</div>';
			jQuery('.page-title').append(btn);
			jQuery('#singkron_kamus_usulan_pokir').on('click', function(){
				singkron_kamus_usulan_pokir(tipe);
			});
		}, 1000);
	}
	// Data Usulan Asmas
	else if(current_url.indexOf('/usulan/usulan-aspirasi') != -1)
	{
		if(current_url.indexOf('/usulan/usulan-aspirasi/pengajuan') != -1){
			console.log('halaman Usulan Aspirasi Masyarakat');		
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_asmas_lokal">Singkron ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_asmas_lokal').on('click', function(){
					singkron_asmas_lokal();
				});
			}, 1000);
		}
		else if(current_url.indexOf('/usulan/usulan-aspirasi/monitor') != -1)
		{
			console.log('halaman Usulan Aspirasi Masyarakat');		
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_asmas_lokal">Singkron ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_asmas_lokal').on('click', function(){
					singkron_asmas_lokal();
				});
			}, 1000);
		}
	}		
	// Data Usulan Pokir
	else if(current_url.indexOf('/usulan/usulan-pokir') != -1)
	{		
		if(current_url.indexOf('/usulan/usulan-pokir/pengajuan') != -1){
			console.log('halaman Usulan Aspirasi Anggota Dewan (Pokir / Reses)');		
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_pokir_lokal">Singkron ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_pokir_lokal').on('click', function(){
					singkron_pokir_lokal();
				});
			}, 1000);
		}
		else if(current_url.indexOf('usulan/usulan-pokir/monitor') != -1)
		{
			console.log('halaman Usulan Aspirasi Anggota Dewan (Pokir / Reses)');		
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'						
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_pokir_lokal">Singkron ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_pokir_lokal').on('click', function(){
					singkron_pokir_lokal();
				});
			}, 1000);
		}
	}
	// standar harga
	else if(current_url.indexOf('/standar_harga') != -1)
	{
		window.type_data_ssh = 'ssh';
		if(current_url.indexOf('/standar_harga/ssh') != -1){
			type_data_ssh = 'SSH';
					
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'
						// +'<button style="margin-left: 20px;" class="btn btn-md btn-warning" id="get_arsip_ssh">Arsip '+type_data_ssh+'</button>'
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_ssh_ke_lokal">Singkron '+type_data_ssh+' ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_ssh_ke_lokal').on('click', function(){
					singkron_ssh_ke_lokal(type_data_ssh);
				});
				jQuery('#get_arsip_ssh').on('click', function(){
					get_arsip_ssh();
				});
			}, 1000);
		}
		else if(current_url.indexOf('/standar_harga/hspk') != -1){
			type_data_ssh = 'HSPK';

			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'
						// +'<button style="margin-left: 20px;" class="btn btn-md btn-warning" id="get_arsip_ssh">Arsip '+type_data_ssh+'</button>'
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_ssh_ke_lokal">Singkron '+type_data_ssh+' ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_ssh_ke_lokal').on('click', function(){
					singkron_ssh_ke_lokal(type_data_ssh);
				});
				jQuery('#get_arsip_ssh').on('click', function(){
					get_arsip_ssh();
				});
			}, 1000);
		}
		else if(current_url.indexOf('/standar_harga/asb') != -1){
			type_data_ssh = 'ASB';

			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'
						// +'<button style="margin-left: 20px;" class="btn btn-md btn-warning" id="get_arsip_ssh">Arsip '+type_data_ssh+'</button>'
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_ssh_ke_lokal">Singkron '+type_data_ssh+' ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_ssh_ke_lokal').on('click', function(){
					singkron_ssh_ke_lokal(type_data_ssh);
				});
				jQuery('#get_arsip_ssh').on('click', function(){
					get_arsip_ssh();
				});
			}, 1000);
		}
		else if(current_url.indexOf('/standar_harga/sbu') != -1){
			type_data_ssh = 'SBU';
				
			setTimeout(function(){
				jQuery('.aksi-extension').remove();
				var btn = ''
					+'<div class="aksi-extension">'
						// +'<button style="margin-left: 20px;" class="btn btn-md btn-warning" id="get_arsip_sbu">Arsip '+type_data_ssh+'</button>'
						+'<button style="margin-left: 20px;" class="btn btn-md btn-danger" id="singkron_ssh_ke_lokal">Singkron '+type_data_ssh+' ke DB Lokal</button>'
					+'</div>';
				jQuery('.page-title').append(btn);
				jQuery('#singkron_ssh_ke_lokal').on('click', function(){
					singkron_ssh_ke_lokal(type_data_ssh);
				});
				jQuery('#get_arsip_sbu').on('click', function(){
					get_arsip_sbu();
				});
			}, 1000);
		}
	}
}