<?php
class Experiencia {
    private $conn;
    private $table_name = "experiencias";

    public $id;
    public $curriculo_id;
    public $empresa;
    public $cargo;
    public $data_inicio;
    public $data_fim;
    public $descricao;
    public $atual;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criar() {
        $query = "INSERT INTO " . $this->table_name . "
                SET curriculo_id=:curriculo_id, empresa=:empresa, cargo=:cargo,
                    data_inicio=:data_inicio, data_fim=:data_fim, 
                    descricao=:descricao, atual=:atual";

        $stmt = $this->conn->prepare($query);

        // Sanitização
        $this->curriculo_id = htmlspecialchars(strip_tags($this->curriculo_id));
        $this->empresa = htmlspecialchars(strip_tags($this->empresa));
        $this->cargo = htmlspecialchars(strip_tags($this->cargo));
        $this->data_inicio = htmlspecialchars(strip_tags($this->data_inicio));
        $this->data_fim = htmlspecialchars(strip_tags($this->data_fim));
        $this->descricao = htmlspecialchars(strip_tags($this->descricao));
        $this->atual = htmlspecialchars(strip_tags($this->atual));

        // Bind
        $stmt->bindParam(":curriculo_id", $this->curriculo_id);
        $stmt->bindParam(":empresa", $this->empresa);
        $stmt->bindParam(":cargo", $this->cargo);
        $stmt->bindParam(":data_inicio", $this->data_inicio);
        $stmt->bindParam(":data_fim", $this->data_fim);
        $stmt->bindParam(":descricao", $this->descricao);
        $stmt->bindParam(":atual", $this->atual);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function buscarPorCurriculo($curriculo_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE curriculo_id = :curriculo_id 
                ORDER BY data_inicio DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':curriculo_id', $curriculo_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>