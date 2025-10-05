<?php
class Habilidade {
    private $conn;
    private $table_name = "habilidades";

    public $id;
    public $curriculo_id;
    public $nome;
    public $nivel;
    public $tipo;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . "
                SET curriculo_id=:curriculo_id, nome=:nome, 
                    nivel=:nivel, tipo=:tipo";

        $stmt = $this->conn->prepare($query);

        // Sanitização
        $this->curriculo_id = htmlspecialchars(strip_tags($this->curriculo_id));
        $this->nome = htmlspecialchars(strip_tags($this->nome));
        $this->nivel = htmlspecialchars(strip_tags($this->nivel));
        $this->tipo = htmlspecialchars(strip_tags($this->tipo));

        // Bind
        $stmt->bindParam(":curriculo_id", $this->curriculo_id);
        $stmt->bindParam(":nome", $this->nome);
        $stmt->bindParam(":nivel", $this->nivel);
        $stmt->bindParam(":tipo", $this->tipo);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function buscarPorCurriculo($curriculo_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE curriculo_id = :curriculo_id 
                ORDER BY tipo, nome";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':curriculo_id', $curriculo_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>