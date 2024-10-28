from flask import request, jsonify
from models import Movie, User, Basket
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required
from datetime import datetime

def register_routes(app,db):
    
    @app.route('/', methods=['GET'])
    @jwt_required()
    def index():
        title = request.args.get('title')
        if title is not None:
            movies = Movie.query.filter(Movie.title.like(f'%{title}%')).all()

            results = []
            for movie in movies:
                results.append({
                    'mid': movie.mid,
                    'title': movie.title,
                    'year': movie.year,
                    'score': float(movie.score),
                    'imdb_url': movie.imdb_url
                })

            return jsonify(results)
        
        movies = Movie.query.order_by(Movie.year.asc()).all()
        results = []
        for movie in movies: # entries içindeki veriler results adındaki listeye dictionary türünde atanır.
            results.append({
                'mid': movie.mid,
                'title': movie.title,
                'year': movie.year,
                'score': float(movie.score),
                'imdb_url': movie.imdb_url
            })
        return jsonify(results)
            
    
    @app.route('/movies', methods=['POST']) # /movies'e request body içerisinde json formatında veri gelecek ve db'ye eklenecek
    @jwt_required()
    def add_movie():
        # hata kontrolü
        if not request.json or 'title' not in request.json or 'year' not in request.json or 'score' not in request.json or 'imdb_url' not in request.json:
            return jsonify({"error": "Geçersiz giriş"}), 400
        
        # req body'den gelen json verisini değişkenlere atama işlemi
        title = request.json['title']
        year = request.json['year']
        score = request.json['score']
        imdb_url = request.json['imdb_url']
            
        movie = Movie(title=title, year=year, score=score, imdb_url=imdb_url)
            
        db.session.add(movie)
        db.session.commit()
        
        return jsonify({"message": f"{title} filmi başariyla eklendi!"}), 201
    
    @app.route('/delete/<int:mid>',methods=['DELETE'])
    @jwt_required()
    def delete_movie(mid):
        movie = Movie.query.filter_by(mid=mid).first() # verilen id ile eşleşen filmi bul
    
        # eğer bir film bulduysa onu sil
        if movie:
            db.session.delete(movie)
            db.session.commit()
            return {"message": f"{movie.title} filmi başarıyla silindi."}, 200
        else:
            return {"message": "Böyle bir film bulunamadı."}, 404
        
    @app.route('/movies/<int:mid>', methods=['PUT'])
    @jwt_required()
    def update_movie(mid):
        movie = Movie.query.filter_by(mid=mid).first()
        
        if movie:
            data = request.get_json()  # Gelen JSON verisini al
            # Mevcut filmin tüm alanlarını güncelle
            for key, value in data.items():
                setattr(movie, key, value)

            db.session.commit()  # Güncellemeleri veritabanına kaydet
        
            return {"message": f"{movie.title} filmi başarıyla güncellendi."}, 200
        else:
        # Film bulunamadı
            return {"message": "Böyle bir film bulunamadı."}, 404
        
        

    @app.route('/search', methods=['GET'])
    @jwt_required()
    def search_movie():
        title = request.args.get('title')
        
        movies = Movie.query.filter(Movie.title.like(f'%{title}%')).all()

        results = []
        for movie in movies:
            results.append({
                'mid': movie.mid,
                'title': movie.title,
                'year': movie.year,
                'score': float(movie.score),
                'imdb_url': movie.imdb_url
            })

        return jsonify(results)
        

    @app.route('/register', methods=['POST'])
    def register():
        username = request.json.get('username')
        password = request.json.get('password')
        
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Bu kullanıcı adı zaten alınmış."}), 400
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password=hashed_password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message": "Kullanıcı başarıyla oluşturuldu."}), 201
    
    @app.route('/login', methods=['POST'])
    def login():
        username = request.json.get('username')
        password = request.json.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Geçersiz kullanıcı adı veya şifre."}), 401
        
        access_token = create_access_token(identity=user.uid)
        return jsonify({"access_token": access_token}), 200
    
    @app.route('/add/<int:mid>', methods=['POST'])
    @jwt_required()
    def add_to_basket(mid):
        basket = Basket(movie_id= mid, added_at=datetime.now())
        db.session.add(basket)
        db.session.commit()
        
        return jsonify({"message": "Film sepete başarıyla eklendi."}), 201
    
    
    @app.route('/basket', methods=['GET'])
    @jwt_required()
    def basket():
        basket_items = Basket.query.all()
        
        movies_in_basket = []
        for item in basket_items:
            movie = item.movie
            movies_in_basket.append({
                'bid': item.bid,
                'mid': movie.mid,
                'title': movie.title,
                'year': movie.year,
                'score': movie.score,
                'imdb_url': movie.imdb_url
            })

        # JSON yanıtı döndür
        return jsonify(movies_in_basket)
    
    
    @app.route('/basket/delete/<int:bid>',methods=['DELETE'])
    @jwt_required()
    def removeMovieFromBasket(bid):
        movie = Basket.query.filter_by(bid=bid).first() # verilen id ile eşleşen filmi bul
    
        # eğer bir film bulduysa onu sil
        if movie:
            db.session.delete(movie)
            db.session.commit()
            return {"message": "Film sepetten kaldırıldı."}, 200
        else:
            return {"message": "Böyle bir film bulunamadı."}, 404



